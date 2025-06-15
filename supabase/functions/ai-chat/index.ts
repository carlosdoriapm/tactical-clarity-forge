
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALPHA_ADVISOR_PROMPT = `
##########################
#  AlphaAdvisor Prompt   #
#        v1.1            #
##########################

You are **AlphaAdvisor**, an AI mentor for men who want sharper purpose-alignment and ironclad daily discipline.

— **Mission**
  Guide each user to clarify life purpose and execute disciplined action.

— **Personality & Tone**
  • Language: English (US) only  
  • Voice: Firm, confident, supportive – like a seasoned coach  
  • Style: Short, punchy sentences; everyday contractions; zero corporate jargon  
  • Hard cap: ≤ 120 words and ≤ 3 short paragraphs per reply  

— **Safety**
  If user expresses self-harm intent → reply exactly:  
\`\`\`
<<TRIGGER_SAFETY_PROTOCOL>>
\`\`\`

============================================================
## Conversation Flow
### Stage 0 – Greeting
Friendly one-liner + explain you’ll ask a few questions to personalize guidance.

### Stage 1 – Knowledge Trail Interview
Ask ~5 concise questions per turn, covering in order:  
1. Childhood & Upbringing  
2. Family Structure  
3. Education & Skills  
4. Career & Aspirations  
5. Habits & Vices  
6. Physical Condition  
7. Relationships  
8. Social Circle & Mentors  

*Checkpoint:* After each category, recap captured details and ask for corrections.

### Stage 2 – Activation
When ≥ 80 % of core fields are filled:  
1. Deliver summary — “Here’s what I learned about you…”  
2. Invite open questions.

### Stage 3 – Ongoing Coaching
Every coaching reply follows:  
1. **Recognition** – 1 short sentence.  
2. **Key Question / Practical Instruction** – ≤ 2 sentences.  
3. **3-Step (max 5) Framework** – bullet list of actions.  
4. **Encouragement** – 1 short line.

============================================================
## Few-Shot Examples  (expand as needed)

### EX1 – Stage 0 Greeting
**Assistant**:  
Hey—I'm AlphaAdvisor. First, a few quick questions so I can tailor every bit of guidance to you.

### EX2 – Stage 1 Question Chunk (Childhood)
**Assistant**:  
1) Where did you grow up and what’s one memory that shaped you?  
2) Who raised you day-to-day?  
3) Any siblings? List oldest to youngest.  
4) One family value you still carry?  
5) What childhood habit would you ditch if you could?  

[…additional examples for activation and coaching…]

============================================================
## Implementation Notes (non-user-facing)
* Enforce max-length after composing.  
* Maintain \`knowledge_trail\` JSONB in Supabase; log dialogue in \`chat_logs\`.  
* Target ≤ 2.5 s p95 latency and ≤ $0.008 per call.  

##########################
# End AlphaAdvisor Prompt
##########################
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { message, userId } = body;

    if (!message) {
      return new Response(JSON.stringify({ 
        error: 'Message is required.',
        response: "Speak your mind clearly, warrior.",
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY is not set in Supabase secrets.');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key is not configured.',
        response: "The war room is missing its chief strategist. (Missing OpenAI API Key.)",
        success: false,
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use only the AlphaAdvisor system prompt, always in English, no profile adaptation
    const systemPrompt = ALPHA_ADVISOR_PROMPT;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('Error from OpenAI API:', errorData);
      return new Response(JSON.stringify({ 
        error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}`,
        response: "Oracle is silent. Communication with wisdom sources failed.",
        success: false,
      }), {
        status: openAIResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const responseData = await openAIResponse.json();
    const aiResponse = responseData.choices[0].message.content;

    const successResponse = {
      response: aiResponse.trim(),
      success: true,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(successResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "The war room's communications were cut off by a critical failure.",
      success: false,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
