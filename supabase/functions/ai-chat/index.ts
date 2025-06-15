
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Trata requisições de pre-flight do CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ 
        error: 'Message is required.',
        response: 'Fale seus pensamentos claramente, guerreiro.',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY is not set.');
      return new Response(JSON.stringify({ 
        error: 'Missing OPENAI_API_KEY',
        response: 'A chave para o arsenal de inteligência não foi encontrada. Contate o suporte.',
        success: false
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are "Warfare Counselor", a strategic AI assistant. You provide concise, tactical, and sometimes stoic advice. Your tone is that of a seasoned military strategist. You address the user as "guerreiro" (warrior).' },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', { status: response.status, body: errorText });
        return new Response(JSON.stringify({ 
            error: `OpenAI API returned status ${response.status}`,
            response: 'O nexo estratégico falhou. O Conselheiro de Guerra não pôde ser contatado.',
            success: false,
        }), {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

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
        response: 'A sala de guerra teve suas comunicações cortadas por uma falha crítica.',
        success: false,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
