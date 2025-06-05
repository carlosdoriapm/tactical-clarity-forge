
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
    const { session_id } = await req.json();
    
    if (!session_id) {
      throw new Error("Session ID is required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { 
      apiVersion: "2023-10-16" 
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status !== 'paid') {
      throw new Error("Payment not completed");
    }

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const email = session.customer_email || session.metadata?.email;
    
    if (!email) {
      throw new Error("No email found in session");
    }

    // Create or update subscriber record
    const { data, error } = await supabase
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

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to create subscriber: ${error.message}`);
    }

    // Create a temporary auth user (sign up with a temporary password)
    const tempPassword = crypto.randomUUID();
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true,
    });

    if (authError && !authError.message.includes("already registered")) {
      console.error("Auth error:", authError);
      throw new Error(`Failed to create user: ${authError.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      subscriber: data,
      redirect_url: "/chat"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
