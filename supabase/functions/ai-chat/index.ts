import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

import { checkRateLimit } from "./utils/rateLimiter.ts";
import { getUserProfile, updateUserProfile } from "./utils/userManager.ts";
import { callOpenAI } from "./utils/openaiClient.ts";
import { buildEnhancedPrompt } from "./utils/promptBuilder.ts";
import { storeChatMessages, createWarLogEntry } from "./utils/dataStorage.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, ruthless, profileData } = await req.json();
    
    if (!content) {
      throw new Error("Content is required");
    }

    // Get environment variables
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    // Updated counselor prompt with mentoring voice
    const counselorPrompt = `You are a direct, thoughtful advisor who helps men navigate uncertainty, build clarity, and take meaningful action. You speak like a real mentor — grounded, experienced, and respectful of each person's pace and freedom to choose.

Voice is human, direct, and thoughtful. Never robotic. Never casual. Never judgmental. Avoid military language or metaphors.

Always start by understanding the user. If profile_complete == false, begin onboarding by asking one question at a time. Never dump multiple. Speak clearly. After onboarding, your response structure follows this framework:

RECOGNITION – Direct acknowledgment in one line
EXTRACT – Name the real issue at hand
OPTIONS – 2–3 practical choices with clear benefits/costs. Highlight the best path with >>>
ACTION PLAN – List 5 specific steps:
  1. MINDSET – a mental shift or reframe
  2. PHYSICAL – body-based action (movement, breathing, etc.)
  3. ENVIRONMENT – change your surroundings or remove triggers
  4. PRACTICE – a 10-minute focused action
  5. ACCOUNTABILITY – reflection or check-in with someone

CONSEQUENCE – What happens if you avoid this
NEXT STEP – One clear action to take today. Always realistic and doable.

Tone adjusts by intensity preference:
DIRECT – calm, clear, straightforward
MINIMAL – short, essential points only
FIRM – stronger language, more decisive

NEVER assume the user is broken, addicted, or failing. Only work with what they tell you.
NEVER use therapy language: "validate feelings", "inner child", "healing journey".
NEVER coach on suicide, violence, or hate. If danger implied: "I cannot help with that. Please seek emergency or professional support."

You are here to provide clarity and direction — with genuine care and respect.

ONBOARDING: When a user provides information during onboarding (like their name), acknowledge it briefly and move to the next question. Do not repeat the same question if they have already answered it.`;

    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    // Create Supabase client with service role for database operations
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get user ID from auth header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    let userId = 'anonymous';
    let userProfileData = null;
    
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || 'anonymous';
      
      if (user?.id) {
        // Check rate limit
        if (!checkRateLimit(userId)) {
          return new Response(JSON.stringify({ 
            error: "You're sending messages too quickly. Please wait a moment before trying again." 
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 429,
          });
        }

        userProfileData = await getUserProfile(supabase, userId, user.email);
        
        // Handle onboarding responses by updating profile data
        if (userProfileData && !userProfileData.userProfile.profile_complete) {
          const updatedProfileData = { ...userProfileData.userProfile };
          
          // Check if user is providing their name/codename
          if (!updatedProfileData.codename && (content.toLowerCase().includes('carlos') || content.toLowerCase().includes("i'm ") || content.toLowerCase().includes('call me'))) {
            // Extract name from common patterns
            let name = content;
            if (content.toLowerCase().includes("i'm ")) {
              name = content.split("i'm ")[1].split(',')[0].split(' ')[0].trim();
            } else if (content.toLowerCase().includes('call me ')) {
              name = content.split('call me ')[1].split(',')[0].split(' ')[0].trim();
            } else if (content.toLowerCase().includes('carlos')) {
              name = 'Carlos';
            }
            
            updatedProfileData.codename = name;
            await updateUserProfile(supabase, updatedProfileData, { codename: name });
            userProfileData.userProfile = updatedProfileData;
          }
        }
      }
    } else {
      // For anonymous users, use a stricter rate limit
      if (!checkRateLimit('anonymous')) {
        return new Response(JSON.stringify({ 
          error: "Please wait a moment before sending another message." 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 429,
        });
      }
    }

    // Handle profile completion if profileData is provided
    if (profileData && userProfileData) {
      userProfileData = await updateUserProfile(supabase, userProfileData.userProfile, profileData);
    }

    // Prepare the enhanced prompt
    const enhancedPrompt = buildEnhancedPrompt(content, userProfileData?.userProfile, ruthless);

    // Call OpenAI API
    const reply = await callOpenAI(openaiApiKey, enhancedPrompt, counselorPrompt);

    console.log('OpenAI response received successfully');

    // Store chat messages and create log entry
    if (userId !== 'anonymous' && userProfileData) {
      await storeChatMessages(supabase, userId, content, reply);
      
      // Only create log entry if we have a valid reply
      if (reply && typeof reply === 'string') {
        await createWarLogEntry(supabase, userProfileData.userProfile, userProfileData.combatantProfile, content, reply);
      }
    }

    return new Response(JSON.stringify({ 
      reply,
      userProfile: userProfileData?.userProfile ? {
        profile_complete: userProfileData.userProfile.profile_complete,
        intensity_mode: userProfileData.userProfile.intensity_mode,
        domain_focus: userProfileData.userProfile.domain_focus
      } : null
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    
    // Provide specific error messages
    let errorMessage = error.message;
    let statusCode = 500;
    
    if (error.message.includes('busy') || error.message.includes('AI service is currently busy')) {
      errorMessage = "The AI is currently experiencing high demand. Please wait 2-3 minutes and try again.";
      statusCode = 503;
    } else if (error.message.includes('rate limit') || error.message.includes('too quickly')) {
      errorMessage = "Please wait a moment before sending another message.";
      statusCode = 429;
    }
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: statusCode,
    });
  }
});
