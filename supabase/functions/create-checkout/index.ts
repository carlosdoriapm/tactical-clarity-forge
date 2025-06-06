
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
    console.log("Starting checkout process...");
    
    const { email } = await req.json();
    
    if (!email) {
      console.error("No email provided");
      throw new Error("Email is required");
    }

    console.log("Email received:", email);

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY not found");
      throw new Error("Stripe configuration error");
    }

    console.log("Stripe key found, initializing...");
    const stripe = new Stripe(stripeKey, { 
      apiVersion: "2023-10-16" 
    });

    // Check for existing customer
    console.log("Looking for existing customer...");
    const customers = await stripe.customers.list({ 
      email: email, 
      limit: 1 
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Found existing customer:", customerId);
    } else {
      console.log("No existing customer found");
    }

    console.log("Creating checkout session...");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      payment_method_types: ['card'], // Explicitly specify payment methods
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
      allow_promotion_codes: true, // Allow discount codes
      metadata: {
        email: email,
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Please check your Stripe configuration and try again"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
