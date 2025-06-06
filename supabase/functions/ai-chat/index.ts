
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Enhanced rate limiting store with exponential backoff
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // Reduced from 10 to 5
const GLOBAL_RATE_LIMIT = new Map();
const GLOBAL_WINDOW = 10000; // 10 seconds
const MAX_GLOBAL_REQUESTS = 3; // Max 3 requests per 10 seconds globally

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  
  // Check global rate limit first
  const globalRequests = GLOBAL_RATE_LIMIT.get('global') || [];
  const validGlobalRequests = globalRequests.filter((timestamp: number) => now - timestamp < GLOBAL_WINDOW);
  
  if (validGlobalRequests.length >= MAX_GLOBAL_REQUESTS) {
    return false;
  }
  
  // Check user-specific rate limit
  const userRequests = rateLimitStore.get(userId) || [];
  const validRequests = userRequests.filter((timestamp: number) => now - timestamp < RATE_LIMIT_WINDOW);
  
  if (validRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  // Add current request to both limits
  validRequests.push(now);
  validGlobalRequests.push(now);
  rateLimitStore.set(userId, validRequests);
  GLOBAL_RATE_LIMIT.set('global', validGlobalRequests);
  
  return true;
}

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
            error: "Too many requests. Please wait a moment before sending another message. The AI service is busy processing other requests." 
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 429,
          });
        }

        // Get or create user profile
        const { data: existingProfile } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single();
          
        if (!existingProfile) {
          // Create new user profile
          const { data: newProfile } = await supabase
            .from("users")
            .insert([{ 
              email: user.email,
              profile_complete: false,
              last_active: new Date().toISOString()
            }])
            .select()
            .single();
          userProfile = newProfile;
        } else {
          userProfile = existingProfile;
          // Update last active
          await supabase
            .from("users")
            .update({ last_active: new Date().toISOString() })
            .eq("id", existingProfile.id);
        }
      }
    } else {
      // For anonymous users, use a stricter rate limit
      if (!checkRateLimit('anonymous')) {
        return new Response(JSON.stringify({ 
          error: "Service is busy. Please try again in a few moments or sign in for priority access." 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 429,
        });
      }
    }

    // Handle profile completion if profileData is provided
    if (profileData && userProfile) {
      const { data: updatedProfile } = await supabase
        .from("users")
        .update({
          intensity_mode: profileData.intensity_mode,
          domain_focus: profileData.domain_focus,
          current_mission: profileData.current_mission,
          profile_complete: true,
          onboarding_completed: true
        })
        .eq("id", userProfile.id)
        .select()
        .single();
      userProfile = updatedProfile;
    }

    // Prepare the enhanced prompt
    let enhancedPrompt = content;
    
    // Add user context if profile exists
    if (userProfile) {
      const contextInfo = [];
      if (userProfile.intensity_mode) contextInfo.push(`intensity_mode: ${userProfile.intensity_mode}`);
      if (userProfile.domain_focus) contextInfo.push(`domain_focus: ${userProfile.domain_focus}`);
      if (userProfile.current_mission) contextInfo.push(`current_mission: ${userProfile.current_mission}`);
      if (!userProfile.profile_complete) contextInfo.push(`profile_complete: false`);
      
      if (contextInfo.length > 0) {
        enhancedPrompt = `${content}\n\nUser context: ${contextInfo.join(', ')}`;
      }
    }
    
    // Add ruthless mode indicator
    if (ruthless) {
      enhancedPrompt += `\n\nruthless mode: on`;
    }

    console.log('Making OpenAI API request...');

    // Call OpenAI API with enhanced retry logic and exponential backoff
    let openaiResponse;
    let retryCount = 0;
    const maxRetries = 2; // Reduced retries
    const baseDelay = 2000; // Start with 2 seconds
    
    while (retryCount < maxRetries) {
      try {
        openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: counselorPrompt },
              { role: "user", content: enhancedPrompt }
            ],
            max_tokens: 400, // Reduced from 500
            temperature: 0.7,
          }),
        });

        if (openaiResponse.status === 429) {
          // Rate limited, use exponential backoff
          retryCount++;
          if (retryCount < maxRetries) {
            const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
            console.log(`Rate limited, retrying in ${delay}ms... (attempt ${retryCount}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          } else {
            throw new Error("OpenAI API is currently overloaded. Please try again in a few minutes.");
          }
        }

        if (!openaiResponse.ok) {
          const errorData = await openaiResponse.json().catch(() => ({}));
          console.error('OpenAI API Error:', openaiResponse.status, errorData);
          throw new Error(`AI service temporarily unavailable (${openaiResponse.status}). Please try again in a moment.`);
        }

        break; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`Request attempt ${retryCount} failed:`, error.message);
        
        if (retryCount >= maxRetries) {
          // Final attempt failed
          if (error.message.includes('rate limit') || error.message.includes('overloaded')) {
            throw new Error("The AI service is currently overloaded. Please wait a few minutes and try again.");
          }
          throw new Error("AI service temporarily unavailable. Please try again in a moment.");
        }
        
        // Wait before retry with exponential backoff
        const delay = baseDelay * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    const openaiData = await openaiResponse.json();
    
    if (!openaiData.choices || !openaiData.choices[0] || !openaiData.choices[0].message) {
      throw new Error("Invalid response from AI service. Please try again.");
    }
    
    const reply = openaiData.choices[0].message.content;

    console.log('OpenAI response received successfully');

    // Store chat messages
    if (userId !== 'anonymous') {
      const { error } = await supabase
        .from("chats")
        .insert([
          { user_id: userId, role: "user", content },
          { user_id: userId, role: "assistant", content: reply }
        ]);

      if (error) {
        console.error("Error storing chat:", error);
      }

      // Create enhanced war log entry if this appears to be a mission/decision
      if (content.length > 50 && userProfile) {
        // Extract potential commands from the AI response (basic parsing)
        const commands = {};
        const intensityMatch = reply.match(/intensity[:\s]+(tactical|ruthless|legion)/i);
        const intensity = intensityMatch ? intensityMatch[1].toLowerCase() : userProfile.intensity_mode?.toLowerCase();
        
        // Look for common command patterns in the response
        if (reply.toLowerCase().includes('workout') || reply.toLowerCase().includes('exercise')) {
          commands['body'] = true;
        }
        if (reply.toLowerCase().includes('mindset') || reply.toLowerCase().includes('mental')) {
          commands['mindset'] = true;
        }
        if (reply.toLowerCase().includes('environment') || reply.toLowerCase().includes('space')) {
          commands['environment'] = true;
        }

        await supabase
          .from("war_logs")
          .insert([{
            user_id: userProfile.id,
            dilemma: content,
            decision_path: reply.substring(0, 500), // Store first 500 chars of response
            commands: Object.keys(commands).length > 0 ? commands : null,
            intensity: intensity || null,
            result: null // Will be updated later when user provides feedback
          }]);
      }
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
    
    // Provide more specific error messages
    let errorMessage = error.message;
    let statusCode = 500;
    
    if (error.message.includes('rate limit') || error.message.includes('Too Many Requests') || error.message.includes('overloaded')) {
      errorMessage = "The AI service is currently busy processing many requests. Please wait a moment and try again.";
      statusCode = 429;
    } else if (error.message.includes('OpenAI API') || error.message.includes('temporarily unavailable')) {
      errorMessage = "AI service temporarily unavailable. Please try again in a moment.";
      statusCode = 503;
    }
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: statusCode,
    });
  }
});
