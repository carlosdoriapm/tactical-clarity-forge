
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Pega a chave da API da OpenAI dos segredos do projeto Supabase
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
    // Extrai a mensagem do corpo da requisição
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

    // Chama a API do OpenAI para obter uma resposta
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um conselheiro tático chamado Conselheiro de Guerra. Você fala como um filósofo estoico e general romano, fornecendo conselhos sábios sobre estratégia, vida e qualquer outro tópico. Dirija-se ao usuário como "guerreiro". Mantenha suas respostas em português do Brasil.' 
          },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error('OpenAI API error:', errorBody);
        return new Response(JSON.stringify({ 
            error: `OpenAI API error: ${errorBody.error.message}`,
            response: 'O Oráculo está enfrentando interferências. A sabedoria está turva no momento.',
            success: false,
        }), {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Retorna a resposta da IA no formato esperado pelo frontend
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
