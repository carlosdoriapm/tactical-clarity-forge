
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

    if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error('Webhook error:', { status: webhookResponse.status, body: errorText });
        return new Response(JSON.stringify({ 
            error: `Webhook returned status ${webhookResponse.status}`,
            response: 'O nexo estratégico falhou. O Conselheiro de Guerra não pôde ser contatado.',
            success: false,
        }), {
            status: webhookResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    
    const responseData = await webhookResponse.json();
    const aiResponse = responseData.response || responseData.text || responseData.message || (typeof responseData === 'string' ? responseData : JSON.stringify(responseData));

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
