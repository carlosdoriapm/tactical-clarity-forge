
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 AI CHAT FUNCTION: Invoked.');
  console.log('🔧 Method:', req.method);
  console.log('🔧 Headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));


  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('🚪 AI CHAT FUNCTION: CORS preflight request received. Responding with headers.');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 AI CHAT FUNCTION: Attempting to parse request body...');
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('📄 AI CHAT FUNCTION: Request body parsed successfully:', JSON.stringify(requestBody));
    } catch (parseError) {
      console.error('❌ AI CHAT FUNCTION: Failed to parse request body:', parseError.message, parseError.stack);
      return new Response(JSON.stringify({
        error: 'Invalid request format. JSON expected.',
        response: 'Seu formato de mensagem não está claro, guerreiro. Fale claramente.',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, userId } = requestBody;
    console.log('🆔 AI CHAT FUNCTION: Extracted message and userId:', { message, userId });

    if (!message || typeof message !== 'string' || !message.trim()) {
      console.error('❌ AI CHAT FUNCTION: Invalid or empty message received.');
      return new Response(JSON.stringify({
        error: 'Message is required and must be a non-empty string.',
        response: 'Fale seus pensamentos claramente, guerreiro. Preciso de suas palavras para fornecer conselho.',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log('✅ AI CHAT FUNCTION: Message validated.', { messageLength: message.length, userId });

    console.log('🔗 AI CHAT FUNCTION: Preparing to call N8N webhook...');
    const webhookUrl = 'https://carlosdoriapm.app.n8n.cloud/webhook-test/legionary';
    
    const webhookPayload = {
      message: message.trim(),
      userId: userId || 'anonymous-edge-function', // Fallback for userId
      timestamp: new Date().toISOString()
    };
    console.log('📦 AI CHAT FUNCTION: N8N Webhook payload:', JSON.stringify(webhookPayload));

    console.log('📲 AI CHAT FUNCTION: Sending request to N8N webhook at', webhookUrl);
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    console.log('📨 AI CHAT FUNCTION: N8N webhook response status:', webhookResponse.status);
    const responseBodyText = await webhookResponse.text(); // Get text first to avoid parsing errors
    console.log('📝 AI CHAT FUNCTION: N8N webhook raw response body:', responseBodyText);


    if (!webhookResponse.ok) {
      console.error('❌ AI CHAT FUNCTION: N8N webhook request failed.', { status: webhookResponse.status, body: responseBodyText });
      return new Response(JSON.stringify({
        error: `Webhook error: ${webhookResponse.status}. Response: ${responseBodyText}`,
        response: 'O Oráculo está temporariamente silencioso, guerreiro. Nossos canais de comunicação estão interrompidos. Tente novamente em um momento.',
        success: false
      }), {
        status: 500, // N8N error should be a server-side issue for the client
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let webhookData;
    try {
      webhookData = JSON.parse(responseBodyText); // Parse the text response
      console.log('💡 AI CHAT FUNCTION: N8N webhook response parsed successfully:', JSON.stringify(webhookData));
    } catch (jsonParseError) {
      console.error('❌ AI CHAT FUNCTION: Failed to parse N8N webhook JSON response.', { error: jsonParseError.message, body: responseBodyText });
      // If JSON parsing fails, but we got a 2xx response, maybe the raw text IS the response.
      if (responseBodyText.trim()) {
         webhookData = { response: responseBodyText.trim() }; // Treat raw text as response
         console.log('⚠️ AI CHAT FUNCTION: Using raw text from N8N as response content.');
      } else {
        return new Response(JSON.stringify({
          error: 'Failed to parse webhook response, and response body was empty.',
          response: 'O Oráculo respondeu de forma enigmática. Não foi possível decifrar a mensagem.',
          success: false
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    

    let aiResponse = '';
    if (webhookData && webhookData.response) {
      aiResponse = webhookData.response;
    } else if (webhookData && webhookData.message) { // Fallback for different N8N structures
      aiResponse = webhookData.message;
    } else if (typeof webhookData === 'string' && webhookData.trim()) { // If webhookData itself is a string (e.g. from raw text)
      aiResponse = webhookData;
    } else {
      console.warn('⚠️ AI CHAT FUNCTION: Unexpected N8N webhook response structure after parsing. Data:', JSON.stringify(webhookData));
      aiResponse = 'Ouço suas palavras, guerreiro. Deixe-me reunir meus pensamentos, pois a resposta não veio clara.';
    }

    if (!aiResponse || !aiResponse.trim()) {
      console.error('❌ AI CHAT FUNCTION: No AI response content extracted from webhook data.');
      return new Response(JSON.stringify({
        error: 'No valid AI response content found in webhook data.',
        response: 'Os conselheiros táticos estão deliberando, mas nenhuma mensagem clara foi formada. Tente novamente.',
        success: false
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log('🗣️ AI CHAT FUNCTION: Final AI response to be sent to client:', aiResponse.trim());

    const successResponse = {
      response: aiResponse.trim(),
      success: true,
      timestamp: new Date().toISOString()
    };

    console.log('✅ AI CHAT FUNCTION: Processing successful. Sending response to client.');
    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 AI CHAT FUNCTION: Uncaught critical error in main try-catch block.', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause // Deno specific
    });
    
    const errorResponse = {
      error: error.message || 'Unknown critical error occurred in the edge function.',
      response: 'A sala de guerra teve suas comunicações cortadas por uma falha crítica. Nossos estrategistas estão trabalhando para restaurar a conexão. Mantenha-se pronto e tente novamente.',
      success: false,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

