
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // Call N8N webhook
    console.log('🔗 Calling N8N webhook...');
    const webhookUrl = 'https://carlosdoriapm.app.n8n.cloud/webhook-test/legionary';
    
    const webhookPayload = {
      message: message.trim(),
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString()
    };

    console.log('Making N8N webhook request...');
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    console.log('N8N webhook response status:', webhookResponse.status);

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error('❌ N8N webhook error:', { status: webhookResponse.status, error: errorText });
      
      return new Response(JSON.stringify({
        error: `Webhook error: ${webhookResponse.status}`,
        response: 'O Oráculo está temporariamente silencioso, guerreiro. Nossos canais de comunicação estão interrompidos. Tente novamente em um momento.',
        success: false
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const webhookData = await webhookResponse.json();
    console.log('N8N webhook response received:', webhookData);

    // Extract the response from webhook data
    let aiResponse = '';
    
    if (webhookData.response) {
      aiResponse = webhookData.response;
    } else if (webhookData.message) {
      aiResponse = webhookData.message;
    } else if (typeof webhookData === 'string') {
      aiResponse = webhookData;
    } else {
      console.warn('⚠️ Unexpected webhook response structure:', webhookData);
      aiResponse = 'Ouço suas palavras, guerreiro. Deixe-me reunir meus pensamentos.';
    }

    if (!aiResponse) {
      console.error('❌ No AI response content from webhook');
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
