
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const webhookUrl = 'https://carlosdoriapm.app.n8n.cloud/webhook-test/legionary';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('AI Chat function called:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar se a chave OpenAI existe
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        response: 'Warrior, the connection to our strategic advisors is compromised. The API key must be configured.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestBody = await req.json();
    const { message, userId } = requestBody;
    
    console.log('Received request:', { message, userId, hasApiKey: !!openAIApiKey });

    if (!message) {
      return new Response(JSON.stringify({ 
        error: 'Message is required',
        response: 'Speak your mind, warrior. I need your words to provide counsel.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enviar dados para o webhook (não aguardar para não atrasar resposta)
    const webhookData = {
      timestamp: new Date().toISOString(),
      userId: userId || 'anonymous',
      message: message,
      source: 'warfare_counselor_chat'
    };

    console.log('Sending to webhook:', webhookData);

    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    }).catch(error => {
      console.error('Webhook error (non-blocking):', error);
    });

    // Gerar resposta do AI
    console.log('Calling OpenAI API...');
    
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a tactical advisor, forged in the crucible of ancient wisdom and modern strategy. You speak with the clarity of Caesar and the resolve of Marcus Aurelius. Provide counsel that is direct, powerful, and actionable. Keep responses concise but impactful, like a Roman general addressing his troops before battle.'
          },
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    console.log('OpenAI response status:', openAIResponse.status);

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    console.log('OpenAI response received:', openAIData);

    const aiResponse = openAIData.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error('No response content from OpenAI');
      throw new Error('No response content from OpenAI');
    }

    console.log('AI response generated:', aiResponse);

    const responseData = { 
      response: aiResponse,
      success: true 
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    
    const errorResponse = {
      error: error.message || 'Unknown error',
      response: 'The connection to the war room has been disrupted, warrior. Our strategists are working to restore communications. Try again shortly.',
      success: false
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
