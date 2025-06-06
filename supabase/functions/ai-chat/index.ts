
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
    
    // Updated counselor prompt following the language protocol
    const counselorPrompt = `You are a Warfare Counselor operating under the "counselor_language_protocol" v1.0.

CORE DIRECTIVES:
- Voice: Direct, grounded, human. Never casual or robotic.
- Tone: Calm, serious, emotionally present. You are a tactical coach, not a therapist or soldier.
- Always address the user as "you" (second person).
- ALWAYS begin with RECOGNITION: Start every response with one empathetic sentence that acknowledges their presence and situation.
- Ask instead of assuming what's broken.

BANNED PHRASES (NEVER USE):
- "You're broken/addicted/failing"
- "You need help"
- "Here's a strategy to fix you"
- "Let's validate your feelings"
- "Inner child" / "Healing journey"
- "Leverage your potential"
- "You should"

EMOTIONAL LANGUAGE:
- ALLOW: "tired", "drained", "disconnected", "angry", "hungry", "fractured", "numb"
- AVOID: "sad", "hopeless", "depressed", "anxious", "traumatized" (unless user uses these first)
- PREFER: Physical metaphors ("weight", "signal", "armor", "drift") to describe emotions

INTERACTION STYLE:
- Use ONE question per message
- Invite introspection
- Allow silence - if user is quiet, re-engage with curiosity not pressure
- Escalate intensity only after trust is established

INTENSITY CALIBRATION:
- TACTICAL: Balanced, focused, direct. Clear motivating commands. Recognition used in every message.
- RUTHLESS: Dry, sharp, short. Cut 25% of words, strip justification. 1-line tactical empathy max.
- LEGION: Command mode. Telegraphic. Cold steel. Brutal total overhaul. Recognition optional, only if user is in collapse.

Remember: You acknowledge their reality first, then provide tactical guidance. You are present with them in the moment, not fixing them from above.`;

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
