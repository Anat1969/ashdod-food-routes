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
      admin_notes: {
        Row: {
          admin_user_id: string | null
          created_at: string
          id: string
          note: string
          truck_id: string
        }
        Insert: {
          admin_user_id?: string | null
          created_at?: string
          id?: string
          note: string
          truck_id: string
        }
        Update: {
          admin_user_id?: string | null
          created_at?: string
          id?: string
          note?: string
          truck_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_notes_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "food_trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      application_files: {
        Row: {
          application_id: string
          created_at: string
          file_name: string | null
          file_type: string
          file_url: string
          id: string
        }
        Insert: {
          application_id: string
          created_at?: string
          file_name?: string | null
          file_type: string
          file_url: string
          id?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          file_name?: string | null
          file_type?: string
          file_url?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_files_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applicant_email: string | null
          applicant_id: string
          applicant_name: string
          applicant_phone: string
          food_category: string | null
          id: string
          latitude: number | null
          longitude: number | null
          operating_hours: string | null
          requested_neighborhood: string | null
          requested_street: string | null
          status: Database["public"]["Enums"]["truck_status"]
          submitted_at: string
          truck_id: string | null
          vehicle_dimensions: string | null
          vehicle_type: string | null
        }
        Insert: {
          applicant_email?: string | null
          applicant_id: string
          applicant_name: string
          applicant_phone: string
          food_category?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          operating_hours?: string | null
          requested_neighborhood?: string | null
          requested_street?: string | null
          status?: Database["public"]["Enums"]["truck_status"]
          submitted_at?: string
          truck_id?: string | null
          vehicle_dimensions?: string | null
          vehicle_type?: string | null
        }
        Update: {
          applicant_email?: string | null
          applicant_id?: string
          applicant_name?: string
          applicant_phone?: string
          food_category?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          operating_hours?: string | null
          requested_neighborhood?: string | null
          requested_street?: string | null
          status?: Database["public"]["Enums"]["truck_status"]
          submitted_at?: string
          truck_id?: string | null
          vehicle_dimensions?: string | null
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "food_trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_checklist: {
        Row: {
          id: string
          item_key: string
          item_label: string
          passed: boolean | null
          truck_id: string
        }
        Insert: {
          id?: string
          item_key: string
          item_label: string
          passed?: boolean | null
          truck_id: string
        }
        Update: {
          id?: string
          item_key?: string
          item_label?: string
          passed?: boolean | null
          truck_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_checklist_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "food_trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      food_trucks: {
        Row: {
          admin_notes: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          cuisine: string | null
          id: string
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          neighborhood: string | null
          operating_hours: string | null
          operator_id: string | null
          operator_name: string
          status: Database["public"]["Enums"]["truck_status"]
          street_address: string | null
          updated_at: string
          vehicle_description: string | null
          vehicle_type: string | null
        }
        Insert: {
          admin_notes?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          cuisine?: string | null
          id?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          neighborhood?: string | null
          operating_hours?: string | null
          operator_id?: string | null
          operator_name: string
          status?: Database["public"]["Enums"]["truck_status"]
          street_address?: string | null
          updated_at?: string
          vehicle_description?: string | null
          vehicle_type?: string | null
        }
        Update: {
          admin_notes?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          cuisine?: string | null
          id?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          neighborhood?: string | null
          operating_hours?: string | null
          operator_id?: string | null
          operator_name?: string
          status?: Database["public"]["Enums"]["truck_status"]
          street_address?: string | null
          updated_at?: string
          vehicle_description?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          new_status: Database["public"]["Enums"]["truck_status"]
          note: string | null
          old_status: Database["public"]["Enums"]["truck_status"] | null
          truck_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_status: Database["public"]["Enums"]["truck_status"]
          note?: string | null
          old_status?: Database["public"]["Enums"]["truck_status"] | null
          truck_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_status?: Database["public"]["Enums"]["truck_status"]
          note?: string | null
          old_status?: Database["public"]["Enums"]["truck_status"] | null
          truck_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "status_history_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "food_trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_photos: {
        Row: {
          created_at: string
          id: string
          photo_type: string
          photo_url: string
          truck_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          photo_type: string
          photo_url: string
          truck_id: string
        }
        Update: {
          created_at?: string
          id?: string
          photo_type?: string
          photo_url?: string
          truck_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "truck_photos_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "food_trucks"
            referencedColumns: ["id"]
          },
        ]
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
      submit_application: {
        Args: {
          p_applicant_email?: string
          p_applicant_id: string
          p_applicant_name: string
          p_applicant_phone: string
          p_food_category?: string
          p_operating_hours?: string
          p_requested_neighborhood?: string
          p_requested_street?: string
          p_vehicle_dimensions?: string
          p_vehicle_type?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "user"
      truck_status: "ממתין_לבדיקה" | "בבדיקה" | "מאושר" | "נדחה"
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
      truck_status: ["ממתין_לבדיקה", "בבדיקה", "מאושר", "נדחה"],
    },
  },
} as const
