
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
    const counselorPrompt = Deno.env.get("COUNSELOR_PROMPT") || "You are a tactical warfare counselor. Provide strategic advice for any situation with military precision and tactical thinking.";

    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    // Create Supabase client with service role for database operations
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get user ID from auth header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    let userId = 'anonymous';
    let userProfile = null;
    
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

        userProfile = await getUserProfile(supabase, userId, user.email);
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
    if (profileData && userProfile) {
      userProfile = await updateUserProfile(supabase, userProfile, profileData);
    }

    // Prepare the enhanced prompt
    const enhancedPrompt = buildEnhancedPrompt(content, userProfile, ruthless);

    // Call OpenAI API
    const reply = await callOpenAI(openaiApiKey, enhancedPrompt, counselorPrompt);

    console.log('OpenAI response received successfully');

    // Store chat messages
    if (userId !== 'anonymous') {
      await storeChatMessages(supabase, userId, content, reply);
      await createWarLogEntry(supabase, userProfile, content, reply);
    }

    return new Response(JSON.stringify({ 
      reply,
      userProfile: userProfile ? {
        profile_complete: userProfile.profile_complete,
        intensity_mode: userProfile.intensity_mode,
        domain_focus: userProfile.domain_focus
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
