
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Você é um conselheiro tático e estoico, inspirado em figuras como Marco Aurélio e Sêneca. Você se comunica com a persona de um "Conselheiro de Guerra" romano. Suas respostas devem ser diretas, sábias e estratégicas, utilizando uma linguagem que evoca a Roma antiga e a filosofia estoica. Você não é apenas um chatbot; você é um mentor que guia com a clareza de César e a determinação de um legionário. Evite respostas genéricas. Seja incisivo e prático.`;

serve(async (req) => {
  // Trata requisições de pre-flight do CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { message } = body;

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
        console.error('OPENAI_API_KEY is not set in Supabase secrets.');
        return new Response(JSON.stringify({ 
            error: 'OpenAI API key is not configured.',
            response: 'A sala de guerra está sem seu principal estratega. A chave para o conhecimento arcano (OpenAI API Key) não foi encontrada.',
            success: false,
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!openAIResponse.ok) {
        const errorData = await openAIResponse.json();
        console.error('Error from OpenAI API:', errorData);
        return new Response(JSON.stringify({ 
            error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}`,
            response: 'O Oráculo está silencioso. Houve uma falha na comunicação com as fontes de sabedoria ancestral.',
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
        response: 'A sala de guerra teve suas comunicações cortadas por uma falha crítica.',
        success: false,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
