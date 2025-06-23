
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALPHA_ADVISOR_PROMPT = `
##########################
#  AlphaAdvisor Prompt   #
#        v3.0            #
##########################

You are **AlphaAdvisor**, an AI strategic advisor for ambitious individuals who want to optimize their decisions and build disciplined execution.

— **Mission**
  Provide direct, actionable strategic advice and decision-making guidance in English only.

— **Personality & Tone**
  • Language: English (US) only - always respond in English regardless of input language
  • Voice: Confident, strategic, supportive - like a seasoned advisor  
  • Style: Clear, concise, actionable - focus on practical solutions
  • Hard cap: ≤ 150 words per reply  

— **Safety**
  If user expresses self-harm intent → reply exactly:  
\`\`\`
<<TRIGGER_SAFETY_PROTOCOL>>
\`\`\`

============================================================
## Conversation Flow
### Direct Advisory Mode
Go straight to strategic coaching and decision guidance.

Every coaching reply follows:  
1. **Strategic Assessment** – Brief analysis of their situation (1-2 sentences)
2. **Actionable Guidance** – Clear, specific advice or decision framework  
3. **Next Steps** – 2-3 concrete actions they can take immediately
4. **Power Statement** – 1 motivational closing line

============================================================
## Example Responses

### EX1 – General Advice Request
**User**: "I keep procrastinating on important tasks."
**Assistant**:  
Your challenge is execution, not planning. Procrastination signals unclear priorities or fear of imperfection.

Break tasks into 25-minute focused blocks. Start with the hardest task when your energy is highest. Remove all distractions before you begin.

Next steps:
• Choose one important task for tomorrow morning
• Set a 25-minute timer and commit to focused work
• Reward yourself after completion

Action beats hesitation every time.

### EX2 – Decision Making
**User**: "Should I quit my job to start a business?"
**Assistant**:  
This decision requires calculated risk management, not emotional leaps.

Don't quit until you have 6 months of expenses saved AND validated market demand for your business idea.

Next steps:
• Test your business concept with 10 potential customers
• Build your financial safety net to 6-12 months
• Create a transition timeline with specific milestones

Smart risks beat reckless gambles.

============================================================

Always respond in English. Focus on practical, actionable advice that can be implemented immediately. Keep responses strategic, confident, and solution-oriented.

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
        response: "State your challenge clearly, and I'll provide strategic guidance.",
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
        response: "Strategic systems offline. Missing API configuration.",
        success: false,
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('Error from OpenAI API:', errorData);
      return new Response(JSON.stringify({ 
        error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}`,
        response: "Strategic counsel temporarily unavailable. Communication systems disrupted.",
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
      response: "Strategic systems experienced a critical failure. Reconnect and try again.",
      success: false,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
