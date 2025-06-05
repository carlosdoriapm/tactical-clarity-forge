
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration missing");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from auth header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    let userId = null;
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    if (req.method === "GET") {
      // Get all rituals for the authenticated user
      const { data: rituals, error } = await supabase
        .from("rituals")
        .select("*")
        .eq("user_id", userId)
        .order("last_completed_at", { ascending: false });

      if (error) {
        throw error;
      }

      return new Response(JSON.stringify(rituals), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (req.method === "PATCH") {
      const { ritual_id, completed_at } = await req.json();
      
      if (!ritual_id) {
        throw new Error("Ritual ID is required");
      }

      // First, get the current ritual to increment streak
      const { data: currentRitual, error: fetchError } = await supabase
        .from("rituals")
        .select("streak_count")
        .eq("id", ritual_id)
        .eq("user_id", userId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const newStreakCount = (currentRitual?.streak_count || 0) + 1;
      const completionTime = completed_at || new Date().toISOString();

      const { data: updatedRitual, error } = await supabase
        .from("rituals")
        .update({
          last_completed_at: completionTime,
          streak_count: newStreakCount
        })
        .eq("id", ritual_id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return new Response(JSON.stringify(updatedRitual), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });

  } catch (error) {
    console.error('Rituals error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
