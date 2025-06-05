
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, ruthless } = await req.json();
    
    if (!content) {
      throw new Error("Content is required");
    }

    // Simulate AI response based on ruthless mode
    let reply;
    if (ruthless) {
      reply = `[RUTHLESS MODE] Listen up, soldier! Here's the brutal truth about your situation: ${content}. Stop making excuses and take decisive action. The battlefield doesn't care about your feelings - only results matter. What's your next tactical move?`;
    } else {
      reply = `I understand you're dealing with: ${content}. Let me provide some strategic guidance to help you navigate this situation effectively. Consider these approaches and choose the one that aligns best with your objectives.`;
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
