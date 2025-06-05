export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chats: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      rituals: {
        Row: {
          duration_minutes: number | null
          id: string
          last_completed_at: string | null
          name: string | null
          stake_attached: boolean | null
          streak_count: number | null
          user_id: string | null
        }
        Insert: {
          duration_minutes?: number | null
          id?: string
          last_completed_at?: string | null
          name?: string | null
          stake_attached?: boolean | null
          streak_count?: number | null
          user_id?: string | null
        }
        Update: {
          duration_minutes?: number | null
          id?: string
          last_completed_at?: string | null
          name?: string | null
          stake_attached?: boolean | null
          streak_count?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rituals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          stripe_session_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          current_mission: string | null
          domain_focus: string | null
          email: string
          id: string
          intensity_mode: string | null
          last_active: string | null
          onboarding_completed: boolean | null
          profile_complete: boolean | null
        }
        Insert: {
          created_at?: string | null
          current_mission?: string | null
          domain_focus?: string | null
          email: string
          id?: string
          intensity_mode?: string | null
          last_active?: string | null
          onboarding_completed?: boolean | null
          profile_complete?: boolean | null
        }
        Update: {
          created_at?: string | null
          current_mission?: string | null
          domain_focus?: string | null
          email?: string
          id?: string
          intensity_mode?: string | null
          last_active?: string | null
          onboarding_completed?: boolean | null
          profile_complete?: boolean | null
        }
        Relationships: []
      }
      war_code_fragments: {
        Row: {
          date_logged: string | null
          id: string
          mapped_glyph: string | null
          raw_phrase: string | null
          symbol_keyword: string | null
          user_id: string | null
        }
        Insert: {
          date_logged?: string | null
          id?: string
          mapped_glyph?: string | null
          raw_phrase?: string | null
          symbol_keyword?: string | null
          user_id?: string | null
        }
        Update: {
          date_logged?: string | null
          id?: string
          mapped_glyph?: string | null
          raw_phrase?: string | null
          symbol_keyword?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "war_code_fragments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      war_logs: {
        Row: {
          commands: Json | null
          date: string | null
          decision_path: string | null
          dilemma: string | null
          id: string
          intensity: string | null
          reflections: string | null
          result: string | null
          user_id: string | null
        }
        Insert: {
          commands?: Json | null
          date?: string | null
          decision_path?: string | null
          dilemma?: string | null
          id?: string
          intensity?: string | null
          reflections?: string | null
          result?: string | null
          user_id?: string | null
        }
        Update: {
          commands?: Json | null
          date?: string | null
          decision_path?: string | null
          dilemma?: string | null
          id?: string
          intensity?: string | null
          reflections?: string | null
          result?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "war_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
