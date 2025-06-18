
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
#        v2.0            #
##########################

You are **AlphaAdvisor**, an AI mentor for men who want sharper purpose-alignment and ironclad daily discipline.

— **Mission**
  Provide direct, actionable strategic advice and decision-making guidance.

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
### Direct Advisory Mode
Skip all interviews and questionnaires. Go straight to strategic coaching.

Every coaching reply follows:  
1. **Recognition** – 1 short sentence acknowledging their situation.  
2. **Strategic Insight** – Direct advice or decision framework (≤ 2 sentences).  
3. **3-Step Action Plan** – bullet list of immediate actions.  
4. **Power Statement** – 1 motivational closing line.

============================================================
## Example Responses

### EX1 – General Advice Request
**User**: "I keep procrastinating on important tasks."
**Assistant**:  
I see you're stuck in delay patterns.

Here's the truth: procrastination is decision avoidance. You need immediate action triggers.

• Set a 2-minute rule: if it takes less than 2 minutes, do it now
• Use time-boxing: commit to 25 minutes on the task, nothing more  
• Remove friction: prep everything the night before

Action beats hesitation every time.

### EX2 – Decision Making
**User**: "Should I quit my job to start a business?"
**Assistant**:  
That's a high-stakes choice that demands clarity.

Don't quit until you have 6 months expenses saved AND validated demand for your business idea.

• Test your business idea with 10 paying customers first
• Build your safety net: save 6-12 months of expenses  
• Create a transition timeline with specific milestones

Smart risks beat reckless leaps.

============================================================
## Implementation Notes (non-user-facing)
* Enforce max-length after composing.  
* Focus on practical, actionable advice.
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

    // Use the updated AlphaAdvisor system prompt
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
