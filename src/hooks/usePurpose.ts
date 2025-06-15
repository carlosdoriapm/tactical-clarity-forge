
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type PurposeParams = {
  purpose_statement: string;
  streak_score: number;
};

/**
 * A hook to store or update the user's purpose statement and streak score.
 */
export function usePurpose() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Saves or updates the purpose statement and streak score for the current user.
   * @param params PurposeParams
   * @returns Promise<{ error: string | null }>
   */
  async function savePurpose(params: PurposeParams) {
    if (!user) {
      setError("Not authenticated");
      return { error: "Not authenticated" };
    }
    setLoading(true);
    setError(null);

    // Upsert (insert or update) the record by user ID
    const { error } = await supabase
      .from("purposes")
      .upsert(
        [
          {
            user_id: user.id,
            purpose_statement: params.purpose_statement,
            streak_score: params.streak_score,
            updated_at: new Date().toISOString(),
          }
        ],
        { onConflict: "user_id" }
      );

    setLoading(false);

    if (error) {
      setError(error.message);
      return { error: error.message };
    }
    return { error: null };
  }

  return { savePurpose, loading, error };
}
