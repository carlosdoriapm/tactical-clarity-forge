
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== PROCESSANDO SUCESSO DO CHECKOUT ===");
    
    const { session_id } = await req.json();
    console.log("Session ID recebido:", session_id);
    
    if (!session_id) {
      throw new Error("Session ID is required");
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeKey, { 
      apiVersion: "2023-10-16" 
    });

    // Retrieve the checkout session
    console.log("Recuperando sessão do Stripe...");
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Status do pagamento:", session.payment_status);
    console.log("Status da sessão:", session.status);
    
    if (session.payment_status !== 'paid') {
      throw new Error("Payment not completed");
    }

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const email = session.customer_email || session.metadata?.email;
    console.log("Email do cliente:", email);
    
    if (!email) {
      throw new Error("No email found in session");
    }

    // Create or update subscriber record
    console.log("Atualizando registro de assinante...");
    const { data: subscriberData, error: subscriberError } = await supabase
      .from("subscribers")
      .upsert({
        email: email,
        stripe_customer_id: session.customer,
        stripe_session_id: session_id,
        subscribed: true,
        subscription_tier: "Premium",
        subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        updated_at: new Date().toISOString(),
      }, { 
        onConflict: 'email',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (subscriberError) {
      console.error("Erro no Supabase (subscriber):", subscriberError);
      throw new Error(`Failed to create subscriber: ${subscriberError.message}`);
    }

    console.log("Assinante criado/atualizado:", subscriberData.id);

    // Try to create auth user, but don't fail if user already exists
    console.log("Tentando criar usuário de autenticação...");
    let authUserId = null;
    
    try {
      const tempPassword = crypto.randomUUID();
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: tempPassword,
        email_confirm: true,
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          console.log("Usuário já existe - buscando usuário existente...");
          
          // Get existing user
          const { data: existingUsers } = await supabase.auth.admin.listUsers({
            page: 1,
            perPage: 1000
          });
          
          const existingUser = existingUsers.users.find(user => user.email === email);
          if (existingUser) {
            authUserId = existingUser.id;
            console.log("Usuário existente encontrado:", authUserId);
          }
        } else {
          console.error("Erro na criação do usuário:", authError);
          throw authError;
        }
      } else {
        authUserId = authData.user.id;
        console.log("Novo usuário criado:", authUserId);
      }
    } catch (authError) {
      console.error("Erro na autenticação:", authError);
      // Continue execution even if auth user creation fails
    }

    // Update subscriber with user_id if we have it
    if (authUserId) {
      console.log("Atualizando assinante com user_id...");
      await supabase
        .from("subscribers")
        .update({ user_id: authUserId })
        .eq('email', email);
    }

    console.log("=== SUCESSO COMPLETO ===");
    return new Response(JSON.stringify({ 
      success: true, 
      subscriber: subscriberData,
      user_id: authUserId,
      redirect_url: "/chat"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("=== ERRO NO PROCESSAMENTO ===");
    console.error("Tipo do erro:", error.constructor.name);
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      errorType: error.constructor.name 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
