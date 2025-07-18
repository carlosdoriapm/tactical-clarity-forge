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
      check_ins: {
        Row: {
          created_at: string | null
          id: string
          mission_id: string
          payload: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mission_id: string
          payload?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mission_id?: string
          payload?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "check_ins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      combatant_profile: {
        Row: {
          age: number | null
          childhood_summary: string | null
          codename: string | null
          created_at: string | null
          fear_block: string | null
          first_recognition: string | null
          id: string
          intensity_mode: string | null
          mission_90_day: string | null
          parents: string | null
          physical_condition: string | null
          profile_complete: boolean | null
          relationship_status: string | null
          school_experience: string | null
          siblings: string | null
          updated_at: string | null
          user_id: string
          vice: string | null
        }
        Insert: {
          age?: number | null
          childhood_summary?: string | null
          codename?: string | null
          created_at?: string | null
          fear_block?: string | null
          first_recognition?: string | null
          id?: string
          intensity_mode?: string | null
          mission_90_day?: string | null
          parents?: string | null
          physical_condition?: string | null
          profile_complete?: boolean | null
          relationship_status?: string | null
          school_experience?: string | null
          siblings?: string | null
          updated_at?: string | null
          user_id: string
          vice?: string | null
        }
        Update: {
          age?: number | null
          childhood_summary?: string | null
          codename?: string | null
          created_at?: string | null
          fear_block?: string | null
          first_recognition?: string | null
          id?: string
          intensity_mode?: string | null
          mission_90_day?: string | null
          parents?: string | null
          physical_condition?: string | null
          profile_complete?: boolean | null
          relationship_status?: string | null
          school_experience?: string | null
          siblings?: string | null
          updated_at?: string | null
          user_id?: string
          vice?: string | null
        }
        Relationships: []
      }
      combatant_war_log: {
        Row: {
          commit: string | null
          completed: boolean | null
          created_at: string | null
          decision_map: Json | null
          extract: string | null
          id: string
          input_text: string
          intensity_mode: string
          profile_id: string | null
          recognition: string | null
          system: Json | null
          user_id: string
          warning: string | null
        }
        Insert: {
          commit?: string | null
          completed?: boolean | null
          created_at?: string | null
          decision_map?: Json | null
          extract?: string | null
          id?: string
          input_text: string
          intensity_mode?: string
          profile_id?: string | null
          recognition?: string | null
          system?: Json | null
          user_id: string
          warning?: string | null
        }
        Update: {
          commit?: string | null
          completed?: boolean | null
          created_at?: string | null
          decision_map?: Json | null
          extract?: string | null
          id?: string
          input_text?: string
          intensity_mode?: string
          profile_id?: string | null
          recognition?: string | null
          system?: Json | null
          user_id?: string
          warning?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      decisions: {
        Row: {
          analysis_result: Json | null
          conversation_id: string | null
          created_at: string | null
          decision_text: string
          id: string
          implementation_date: string | null
          review_date: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          analysis_result?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          decision_text: string
          id?: string
          implementation_date?: string | null
          review_date?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          analysis_result?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          decision_text?: string
          id?: string
          implementation_date?: string | null
          review_date?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "decisions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          priority: string | null
          progress: number | null
          status: string
          target_date: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          progress?: number | null
          status?: string
          target_date?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          progress?: number | null
          status?: string
          target_date?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      habit_nudges: {
        Row: {
          created_at: string
          habit_id: string
          id: string
          missed_days: number
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          habit_id: string
          id?: string
          missed_days: number
          text: string
          user_id: string
        }
        Update: {
          created_at?: string
          habit_id?: string
          id?: string
          missed_days?: number
          text?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          description: string | null
          end_date: string | null
          id: string
          start_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          title: string
          user_id: string
        }
        Update: {
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "missions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_specs: {
        Row: {
          created_at: string | null
          feature_name: string
          id: string
          specification: Json | null
        }
        Insert: {
          created_at?: string | null
          feature_name: string
          id?: string
          specification?: Json | null
        }
        Update: {
          created_at?: string | null
          feature_name?: string
          id?: string
          specification?: Json | null
        }
        Relationships: []
      }
      purposes: {
        Row: {
          purpose_statement: string
          streak_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          purpose_statement: string
          streak_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          purpose_statement?: string
          streak_score?: number
          updated_at?: string
          user_id?: string
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      is_admin: {
        Args: { p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
