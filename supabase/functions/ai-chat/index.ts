
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const webhookUrl = 'https://carlosdoriapm.app.n8n.cloud/webhook-test/legionary';

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseText = await webhookResponse.text();
    console.log('Response from n8n webhook:', {
        status: webhookResponse.status,
        headers: Object.fromEntries(webhookResponse.headers.entries()),
        body: responseText,
    });

    if (!webhookResponse.ok) {
        console.error('Webhook error:', { status: webhookResponse.status, body: responseText });
        return new Response(JSON.stringify({ 
            error: `Webhook returned status ${webhookResponse.status}`,
            response: `O nexo estratégico falhou. O Conselheiro de Guerra não pôde ser contatado (Status: ${webhookResponse.status}).`,
            success: false,
        }), {
            status: webhookResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    
    let aiResponse;
    try {
      // Tenta analisar como JSON
      const responseData = JSON.parse(responseText);
      aiResponse = responseData.response || responseData.text || responseData.message || JSON.stringify(responseData);
    } catch (e) {
      // Se não for JSON, usa o texto bruto como resposta
      aiResponse = responseText;
    }

    const successResponse = {
      response: aiResponse.toString().trim(),
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
