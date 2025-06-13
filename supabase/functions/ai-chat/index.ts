
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('=== AI CHAT FUNCTION START ===');
  console.log('Method:', req.method);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar chave API
    console.log('Checking OpenAI API key...');
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not found');
      return new Response(JSON.stringify({ 
        error: 'API key not configured',
        response: 'Os sistemas de comunicação estão offline, guerreiro. Entre em contato com seu comandante para restaurar a conexão.',
        success: false
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log('✅ OpenAI API key found');

    // Parse request body
    console.log('Parsing request body...');
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request body parsed:', requestBody);
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return new Response(JSON.stringify({
        error: 'Invalid request format',
        response: 'Seu formato de mensagem não está claro, guerreiro. Fale claramente.',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, userId } = requestBody;

    // Validate message
    if (!message || typeof message !== 'string' || !message.trim()) {
      console.error('❌ Invalid or empty message');
      return new Response(JSON.stringify({
        error: 'Message required',
        response: 'Fale seus pensamentos claramente, guerreiro. Preciso de suas palavras para fornecer conselho.',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Message validated:', { messageLength: message.length, userId });

    // Call OpenAI API directly (removing webhook dependency)
    console.log('🤖 Calling OpenAI API...');
    const openAIPayload = {
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { 
          role: 'system', 
          content: 'Você é um conselheiro tático, forjado no cadinho da sabedoria antiga e estratégia moderna. Você fala com a clareza de César e a determinação de Marco Aurélio. Forneça conselhos diretos, poderosos e práticos. Mantenha as respostas concisas mas impactantes, como um general romano dirigindo-se às suas tropas antes da batalha. Máximo 200 palavras. Responda sempre em português.'
        },
        { role: 'user', content: message.trim() }
      ],
      max_tokens: 300,
      temperature: 0.7,
    };

    console.log('Making OpenAI request...');
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(openAIPayload),
    });

    console.log('OpenAI response status:', openAIResponse.status);

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('❌ OpenAI API error:', { status: openAIResponse.status, error: errorText });
      
      return new Response(JSON.stringify({
        error: `OpenAI API error: ${openAIResponse.status}`,
        response: 'O Oráculo está temporariamente silencioso, guerreiro. Nossos canais de comunicação estão interrompidos. Tente novamente em um momento.',
        success: false
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIData = await openAIResponse.json();
    console.log('OpenAI response received:', { 
      choices: openAIData.choices?.length || 0,
      usage: openAIData.usage 
    });

    const aiResponse = openAIData.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error('❌ No AI response content');
      return new Response(JSON.stringify({
        error: 'No AI response',
        response: 'Os conselheiros táticos estão deliberando, guerreiro. Sua solicitação está sendo processada. Tente novamente.',
        success: false
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ AI response generated successfully');

    const successResponse = {
      response: aiResponse.trim(),
      success: true,
      timestamp: new Date().toISOString()
    };

    console.log('=== AI CHAT FUNCTION SUCCESS ===');
    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== AI CHAT FUNCTION ERROR ===');
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    const errorResponse = {
      error: error.message || 'Unknown error',
      response: 'A sala de guerra teve suas comunicações cortadas, guerreiro. Nossos estrategistas estão trabalhando para restaurar a conexão. Mantenha-se pronto e tente novamente.',
      success: false,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
