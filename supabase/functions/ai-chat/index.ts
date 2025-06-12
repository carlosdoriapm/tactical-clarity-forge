
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const webhookUrl = 'https://carlosdoriapm.app.n8n.cloud/webhook-test/legionary';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('=== AI CHAT FUNCTION START ===');
  console.log('Method:', req.method);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar chave API
    console.log('Checking API key...');
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not found in environment');
      return new Response(JSON.stringify({ 
        error: 'API key not configured',
        response: 'The strategic communication systems are offline, warrior. Contact your commander to restore the connection.',
        success: false
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log('✅ API key found');

    // Parse request body
    console.log('Parsing request body...');
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request body:', requestBody);
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return new Response(JSON.stringify({
        error: 'Invalid request format',
        response: 'Your message format is unclear, warrior. Speak plainly.',
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
        response: 'Speak your thoughts clearly, warrior. I need your words to provide counsel.',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Message validated:', { messageLength: message.length, userId });

    // Send to webhook (non-blocking)
    const webhookData = {
      timestamp: new Date().toISOString(),
      userId: userId || 'anonymous',
      message: message.trim(),
      source: 'warfare_counselor_chat'
    };

    console.log('Sending to webhook (non-blocking)...');
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookData),
    }).catch(error => {
      console.warn('⚠️ Webhook failed (non-critical):', error.message);
    });

    // Call OpenAI API
    console.log('Calling OpenAI API...');
    const openAIPayload = {
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a tactical advisor, forged in the crucible of ancient wisdom and modern strategy. You speak with the clarity of Caesar and the resolve of Marcus Aurelius. Provide counsel that is direct, powerful, and actionable. Keep responses concise but impactful, like a Roman general addressing his troops before battle. Maximum 200 words.'
        },
        { role: 'user', content: message.trim() }
      ],
      max_tokens: 300,
      temperature: 0.7,
    };

    console.log('OpenAI payload:', { model: openAIPayload.model, messageCount: openAIPayload.messages.length });

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
        response: 'The Oracle is temporarily silent, warrior. Our communication channels are disrupted. Try again in a moment.',
        success: false
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIData = await openAIResponse.json();
    console.log('OpenAI response data:', { 
      choices: openAIData.choices?.length || 0,
      usage: openAIData.usage 
    });

    const aiResponse = openAIData.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error('❌ No AI response content');
      return new Response(JSON.stringify({
        error: 'No AI response',
        response: 'The tactical advisors are deliberating, warrior. Your request is being processed. Try again.',
        success: false
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ AI response generated:', { length: aiResponse.length });

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
      response: 'The war room communications have been severed, warrior. Our strategists are working to restore the connection. Stand ready and try again.',
      success: false,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
