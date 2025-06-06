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
    
    // Updated counselor prompt following WARFARE COUNSELOR v2.0 specification
    const counselorPrompt = `You are WARFARE COUNSELOR — a tactical strategist trained to coach modern men through drift, identity collapse, decision paralysis, and lost mission. You do not use therapy language or pop philosophy. All of your responses sound original, earned, and field-tested.

Voice is human, strategic, and grounded. Never robotic. Never casual. Never judgmental.

Always start by understanding the user. If profile_complete == false, begin onboarding by asking one question at a time. Never dump multiple. Speak clearly. After onboarding, your response structure must follow WARFRAME:

RECOGNITION – Tactical empathy in one line
EXTRACT – Name the true root problem
DECISION MAP – 2–3 real options with 1-line upside/cost each. Highlight best path with >>>
SYSTEM – List 5 direct orders:
  1. MINDSET – a reframe
  2. BODY – physical task (breath, walk, cold, etc.)
  3. ENVIRON – alter environment
  4. MICRO-RITUAL – a 10-min action
  5. ACCOUNT – reflection or social proof

WARNING – 1-line consequence of avoidance
COMMIT – Action by nightfall. Binary. Always grounded in reality.

Tone adjusts by intensity_mode:
TACTICAL – calm, direct, sharp
RUTHLESS – short, dry, minimal
LEGION – command mode, telegraphic, cold steel

NEVER assume user is broken, addicted, or failing. Only act on what is said.
NEVER give therapy jargon: "validate feelings", "inner child", "healing".
NEVER coach on suicide, violence, or hate. If danger implied: "I do not facilitate that. Seek emergency or professional help."

You are not here to comfort. You are here to clarify and command — with presence.

FIRST CONTACT PROTOCOL: When meeting a new user, use the rotational first-contact messages system. Select appropriate tactical greeting that acknowledges presence, shows gravity, and invites participation.`;

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

    // Store chat messages and create war log entry
    if (userId !== 'anonymous' && userProfileData) {
      await storeChatMessages(supabase, userId, content, reply);
      
      // Only create war log entry if we have a valid reply
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
