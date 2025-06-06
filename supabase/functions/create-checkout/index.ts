
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== INICIO DO CHECKOUT PROCESS ===");
    
    const { email } = await req.json();
    console.log("Email recebido:", email);
    
    if (!email) {
      console.error("ERRO: Email não fornecido");
      throw new Error("Email is required");
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("ERRO: STRIPE_SECRET_KEY não encontrada");
      throw new Error("Stripe configuration error");
    }

    console.log("Chave Stripe encontrada, iniciando Stripe...");
    console.log("Tipo da chave:", stripeKey.startsWith("sk_test_") ? "TESTE" : "PRODUÇÃO");
    
    const stripe = new Stripe(stripeKey, { 
      apiVersion: "2023-10-16" 
    });

    // Check for existing customer
    console.log("Procurando cliente existente...");
    const customers = await stripe.customers.list({ 
      email: email, 
      limit: 1 
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Cliente existente encontrado:", customerId);
    } else {
      console.log("Nenhum cliente existente encontrado");
    }

    console.log("=== CRIANDO SESSÃO DE CHECKOUT ===");
    const sessionConfig = {
      customer: customerId,
      customer_email: customerId ? undefined : email,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "Warfare Counselor™ Premium" 
            },
            unit_amount: 1900, // $19.00
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/`,
      allow_promotion_codes: true,
      metadata: {
        email: email,
      },
    };

    console.log("Configuração da sessão:", JSON.stringify(sessionConfig, null, 2));

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log("=== SESSÃO CRIADA COM SUCESSO ===");
    console.log("Session ID:", session.id);
    console.log("Session URL:", session.url);
    console.log("Modo:", session.mode);
    console.log("Status:", session.status);

    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id,
      mode: session.mode 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("=== ERRO NO CHECKOUT ===");
    console.error("Tipo do erro:", error.constructor.name);
    console.error("Mensagem do erro:", error.message);
    console.error("Stack trace:", error.stack);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Please check your Stripe configuration and try again",
      errorType: error.constructor.name
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
