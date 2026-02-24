export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string | null
          created_at: string
          id: string
          new_status: string | null
          note: string | null
          old_status: string | null
          truck_id: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string
          id?: string
          new_status?: string | null
          note?: string | null
          old_status?: string | null
          truck_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string
          id?: string
          new_status?: string | null
          note?: string | null
          old_status?: string | null
          truck_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "food_trucks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_checklist: {
        Row: {
          access_path_90cm: boolean | null
          checked_at: string
          checked_by: string | null
          counter_height_ok: boolean | null
          distance_from_curb_cm: number | null
          edge_kitchen_only: boolean | null
          fire_suppression_ok: boolean | null
          id: string
          no_alcohol_tobacco: boolean | null
          notes: string | null
          professional_design: boolean | null
          signage_approved: boolean | null
          truck_id: string
          wheelchair_space_ok: boolean | null
        }
        Insert: {
          access_path_90cm?: boolean | null
          checked_at?: string
          checked_by?: string | null
          counter_height_ok?: boolean | null
          distance_from_curb_cm?: number | null
          edge_kitchen_only?: boolean | null
          fire_suppression_ok?: boolean | null
          id?: string
          no_alcohol_tobacco?: boolean | null
          notes?: string | null
          professional_design?: boolean | null
          signage_approved?: boolean | null
          truck_id: string
          wheelchair_space_ok?: boolean | null
        }
        Update: {
          access_path_90cm?: boolean | null
          checked_at?: string
          checked_by?: string | null
          counter_height_ok?: boolean | null
          distance_from_curb_cm?: number | null
          edge_kitchen_only?: boolean | null
          fire_suppression_ok?: boolean | null
          id?: string
          no_alcohol_tobacco?: boolean | null
          notes?: string | null
          professional_design?: boolean | null
          signage_approved?: boolean | null
          truck_id?: string
          wheelchair_space_ok?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_checklist_checked_by_fkey"
            columns: ["checked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_checklist_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "food_trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_opinions: {
        Row: {
          author_id: string | null
          compliance_summary: string | null
          conditions: string | null
          created_at: string
          environment_ok: boolean | null
          executive_summary: string | null
          field_notes: string | null
          id: string
          is_final: boolean
          location_analysis: string | null
          opinion_date: string
          project_description: string | null
          recommendation: string | null
          structure_ok: boolean | null
          truck_id: string
        }
        Insert: {
          author_id?: string | null
          compliance_summary?: string | null
          conditions?: string | null
          created_at?: string
          environment_ok?: boolean | null
          executive_summary?: string | null
          field_notes?: string | null
          id?: string
          is_final?: boolean
          location_analysis?: string | null
          opinion_date?: string
          project_description?: string | null
          recommendation?: string | null
          structure_ok?: boolean | null
          truck_id: string
        }
        Update: {
          author_id?: string | null
          compliance_summary?: string | null
          conditions?: string | null
          created_at?: string
          environment_ok?: boolean | null
          executive_summary?: string | null
          field_notes?: string | null
          id?: string
          is_final?: boolean
          location_analysis?: string | null
          opinion_date?: string
          project_description?: string | null
          recommendation?: string | null
          structure_ok?: boolean | null
          truck_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_opinions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_opinions_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "food_trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      food_trucks: {
        Row: {
          aerial_photo_url: string | null
          business_license_url: string | null
          created_at: string
          design_mockup_url: string | null
          food_category: string | null
          hours_from: string | null
          hours_to: string | null
          id: string
          location_id: string | null
          operator_id: string | null
          operator_name: string | null
          status: string
          street_photo_1_url: string | null
          street_photo_2_url: string | null
          submitted_at: string | null
          truck_name: string
          updated_at: string
          vehicle_photo_url: string | null
          vehicle_type: string | null
        }
        Insert: {
          aerial_photo_url?: string | null
          business_license_url?: string | null
          created_at?: string
          design_mockup_url?: string | null
          food_category?: string | null
          hours_from?: string | null
          hours_to?: string | null
          id?: string
          location_id?: string | null
          operator_id?: string | null
          operator_name?: string | null
          status?: string
          street_photo_1_url?: string | null
          street_photo_2_url?: string | null
          submitted_at?: string | null
          truck_name: string
          updated_at?: string
          vehicle_photo_url?: string | null
          vehicle_type?: string | null
        }
        Update: {
          aerial_photo_url?: string | null
          business_license_url?: string | null
          created_at?: string
          design_mockup_url?: string | null
          food_category?: string | null
          hours_from?: string | null
          hours_to?: string | null
          id?: string
          location_id?: string | null
          operator_id?: string | null
          operator_name?: string | null
          status?: string
          street_photo_1_url?: string | null
          street_photo_2_url?: string | null
          submitted_at?: string | null
          truck_name?: string
          updated_at?: string
          vehicle_photo_url?: string | null
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_trucks_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_trucks_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          building_area_sqm: number | null
          chelka: string | null
          gush: string | null
          id: string
          infra_electricity: boolean
          infra_sewage: boolean
          infra_water: boolean
          is_desired: boolean
          lat: number | null
          lng: number | null
          location_type: string | null
          name: string
          neighborhood: string | null
          street: string | null
          surrounding_area_sqm: number | null
        }
        Insert: {
          building_area_sqm?: number | null
          chelka?: string | null
          gush?: string | null
          id?: string
          infra_electricity?: boolean
          infra_sewage?: boolean
          infra_water?: boolean
          is_desired?: boolean
          lat?: number | null
          lng?: number | null
          location_type?: string | null
          name: string
          neighborhood?: string | null
          street?: string | null
          surrounding_area_sqm?: number | null
        }
        Update: {
          building_area_sqm?: number | null
          chelka?: string | null
          gush?: string | null
          id?: string
          infra_electricity?: boolean
          infra_sewage?: boolean
          infra_water?: boolean
          is_desired?: boolean
          lat?: number | null
          lng?: number | null
          location_type?: string | null
          name?: string
          neighborhood?: string | null
          street?: string | null
          surrounding_area_sqm?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_privileged: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
