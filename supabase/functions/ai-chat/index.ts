
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
    
    const { content, ruthless = false } = await req.json();
    console.log('User message:', content);
    
    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check rate limiting
    const rateLimitCheck = await checkRateLimit(supabaseClient, user.id);
    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({ 
          error: `Rate limit exceeded. Please wait ${rateLimitCheck.waitTime} seconds before sending another message.` 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get or create user profile data
    const userProfileData = await getUserProfile(supabaseClient, user.id, user.email!);
    
    console.log('=== INITIAL PROFILE DATA ===');
    console.log('User profile:', JSON.stringify(userProfileData.userProfile, null, 2));
    console.log('Combatant profile:', JSON.stringify(userProfileData.combatantProfile, null, 2));

    // Name detection logic
    console.log('=== NAME DETECTION LOGIC ===');
    console.log('Current combatant profile codename:', userProfileData.combatantProfile?.codename);
    
    const trimmedContent = content.trim();
    
    // Check if this looks like a name response and we don't have a name yet
    const looksLikeName = /^[a-zA-Z\s]{1,50}$/.test(trimmedContent) && 
                         trimmedContent.split(' ').length <= 3 &&
                         !['yes', 'no', 'maybe', 'help', 'ok', 'sure'].includes(trimmedContent.toLowerCase());
    
    if (!userProfileData.combatantProfile?.codename && looksLikeName) {
      console.log('Processing user input for name:', trimmedContent);
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
        console.log('Updated combatant profile:', JSON.stringify(updatedProfiles.combatantProfile, null, 2));
      } catch (error) {
        console.error('=== ERROR SAVING NAME ===', error);
        throw error;
      }
    }

    console.log('=== FINAL PROFILE DATA FOR PROMPT ===');
    console.log('Final user profile:', JSON.stringify(userProfileData.userProfile, null, 2));
    console.log('Final combatant profile:', JSON.stringify(userProfileData.combatantProfile, null, 2));

    // Build the enhanced prompt
    const enhancedPrompt = buildEnhancedPrompt(content, userProfileData, ruthless);
    
    console.log('=== GENERATED PROMPT ===');
    console.log('Enhanced prompt:', enhancedPrompt);

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
    
    console.log('OpenAI response received successfully');
    console.log('=== CHAT REQUEST END ===');

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message.includes('quota') 
          ? 'Service quota exceeded. Please try again later.'
          : 'An error occurred processing your request.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
