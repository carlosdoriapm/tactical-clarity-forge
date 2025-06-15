
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NudgeRequest {
  user_first_name: string;
  habit_name: string;
  missed_days: number;
  last_success_date: string;
  habit_id: string;
  user_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const nudgeRequest: NudgeRequest = await req.json();
    console.log('Habit Drift Detector request:', nudgeRequest);

    const { user_first_name, habit_name, missed_days, last_success_date, habit_id, user_id } = nudgeRequest;

    // Validate input
    if (!user_first_name || !habit_name || missed_days < 2) {
      throw new Error('Invalid request parameters');
    }

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.55,
        max_tokens: 60,
        messages: [
          {
            role: "system",
            content: "You draft ultra-concise motivational nudges for a men's discipline app. Output ONE line, ≤ 25 words, English. Tone: confident, no fluff, positive pressure. If the user missed 2-3 days: inspire quick comeback. If >3 days: stronger urgency. Never mention days explicitly; focus on next action."
          },
          {
            role: "user",
            content: `NAME: ${user_first_name}\nHABIT: ${habit_name}\nMISSED_DAYS: ${missed_days}\nLAST_SUCCESS: ${last_success_date}`
          }
        ]
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate nudge');
    }

    const openAIData = await openAIResponse.json();
    const nudgeText = openAIData.choices[0].message.content.trim();

    console.log('Generated nudge:', nudgeText);

    // Validate output
    if (nudgeText.length < 6 || nudgeText.length > 120) {
      throw new Error('Generated nudge does not meet length requirements');
    }

    // Check for invalid content (basic validation)
    const invalidPatterns = [
      /\bwe\b|\bus\b/i,
      /sorry|apologize/i,
      /português|pt-br/i
    ];
    
    if (invalidPatterns.some(pattern => pattern.test(nudgeText))) {
      throw new Error('Generated nudge contains invalid content');
    }

    // Store nudge in database
    const { error: insertError } = await supabase
      .from('habit_nudges')
      .insert({
        user_id,
        habit_id,
        text: nudgeText,
        missed_days
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to store nudge');
    }

    console.log('Nudge stored successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        nudge: nudgeText,
        missed_days 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in hdd_nudge function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
