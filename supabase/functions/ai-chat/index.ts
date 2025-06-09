
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { getUserProfile, updateUserProfile } from "./utils/userManager.ts";
import { buildEnhancedPrompt } from "./utils/promptBuilder.ts";
import { createOpenAIClient } from "./utils/openaiClient.ts";
import { checkRateLimit } from "./utils/rateLimiter.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== CHAT REQUEST START ===');
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    // Parse request body with error handling
    let requestBody;
    try {
      const bodyText = await req.text();
      console.log('Raw request body:', bodyText);
      
      if (!bodyText || bodyText.trim() === '') {
        throw new Error('Request body is empty');
      }
      
      requestBody = JSON.parse(bodyText);
      console.log('Parsed request body:', requestBody);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const { content, ruthless = false } = requestBody;
    
    if (!content || typeof content !== 'string') {
      console.error('Missing or invalid content in request');
      return new Response(
        JSON.stringify({ error: 'Content is required and must be a string' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log('User message:', content);
    
    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No valid authorization header');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted, length:', token.length);
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        } 
      }
    );
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    console.log('User from auth:', user?.email, 'Auth error:', authError);
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check rate limit
    const rateLimitCheck = await checkRateLimit(supabaseClient, user.id);
    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({ 
          error: `Please wait ${rateLimitCheck.waitTime} seconds before sending another message.` 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get or create user profile data
    const userProfileData = await getUserProfile(supabaseClient, user.id, user.email!);
    
    console.log('=== PROFILE DATA ===');
    console.log('User profile exists:', !!userProfileData.userProfile);
    console.log('Combatant profile exists:', !!userProfileData.combatantProfile);

    // Name detection logic
    const trimmedContent = content.trim();
    
    // Check if this looks like a name response and we don't have a name yet
    const looksLikeName = /^[a-zA-Z\s]{1,50}$/.test(trimmedContent) && 
                         trimmedContent.split(' ').length <= 3 &&
                         !['yes', 'no', 'maybe', 'help', 'ok', 'sure'].includes(trimmedContent.toLowerCase());
    
    if (!userProfileData.combatantProfile?.codename && looksLikeName) {
      console.log('=== SAVING NAME ===');
      console.log('Detected name to save:', trimmedContent);
      
      try {
        const updatedProfiles = await updateUserProfile(
          supabaseClient,
          userProfileData.userProfile,
          { codename: trimmedContent }
        );
        
        // Update our local data
        userProfileData.userProfile = updatedProfiles.userProfile;
        userProfileData.combatantProfile = updatedProfiles.combatantProfile;
        
        console.log('=== NAME SAVED SUCCESSFULLY ===');
      } catch (error) {
        console.error('=== ERROR SAVING NAME ===', error);
        throw error;
      }
    }

    // Build the enhanced prompt
    const enhancedPrompt = buildEnhancedPrompt(content, userProfileData, ruthless);
    
    console.log('=== ENHANCED PROMPT ===');
    console.log('Enhanced prompt length:', enhancedPrompt.length);

    // Make OpenAI request
    console.log('Making OpenAI API request...');
    const openai = createOpenAIClient();
    
    const messages: Message[] = [
      {
        role: "user",
        content: enhancedPrompt
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    console.log('=== OPENAI RESPONSE ===');
    const reply = response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
    
    console.log('OpenAI response received successfully, length:', reply.length);
    console.log('=== CHAT REQUEST END ===');

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message?.includes('quota') 
          ? 'Service quota exceeded. Please try again later.'
          : 'An error occurred processing your request. Please try again.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
