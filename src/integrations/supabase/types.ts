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
      animals: {
        Row: {
          breed: string
          created_at: string
          date_of_birth: string
          deleted_at: string | null
          gender: string
          health_status: string | null
          id: string
          name: string
          notes: string | null
          photo_url: string | null
          source: string
          tag: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          breed: string
          created_at?: string
          date_of_birth: string
          deleted_at?: string | null
          gender?: string
          health_status?: string | null
          id?: string
          name: string
          notes?: string | null
          photo_url?: string | null
          source: string
          tag?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          breed?: string
          created_at?: string
          date_of_birth?: string
          deleted_at?: string | null
          gender?: string
          health_status?: string | null
          id?: string
          name?: string
          notes?: string | null
          photo_url?: string | null
          source?: string
          tag?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      animals_history: {
        Row: {
          animal_id: string
          breed: string | null
          changed_at: string
          changed_by: string | null
          date_of_birth: string | null
          gender: string | null
          health_status: string | null
          id: string
          name: string | null
          notes: string | null
          operation_type: string
          photo_url: string | null
          source: string | null
          tag: string | null
          user_id: string
        }
        Insert: {
          animal_id: string
          breed?: string | null
          changed_at?: string
          changed_by?: string | null
          date_of_birth?: string | null
          gender?: string | null
          health_status?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          operation_type: string
          photo_url?: string | null
          source?: string | null
          tag?: string | null
          user_id: string
        }
        Update: {
          animal_id?: string
          breed?: string | null
          changed_at?: string
          changed_by?: string | null
          date_of_birth?: string | null
          gender?: string | null
          health_status?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          operation_type?: string
          photo_url?: string | null
          source?: string | null
          tag?: string | null
          user_id?: string
        }
        Relationships: []
      }
      breeding_records: {
        Row: {
          actual_calving_date: string | null
          animal_id: string
          bull_ai_source: string | null
          conception_status: string | null
          created_at: string
          date_of_heat: string | null
          deleted_at: string | null
          expected_calving_date: string | null
          id: string
          mating_method: string | null
          notes: string | null
          pregnancy_confirmation_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_calving_date?: string | null
          animal_id: string
          bull_ai_source?: string | null
          conception_status?: string | null
          created_at?: string
          date_of_heat?: string | null
          deleted_at?: string | null
          expected_calving_date?: string | null
          id?: string
          mating_method?: string | null
          notes?: string | null
          pregnancy_confirmation_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_calving_date?: string | null
          animal_id?: string
          bull_ai_source?: string | null
          conception_status?: string | null
          created_at?: string
          date_of_heat?: string | null
          deleted_at?: string | null
          expected_calving_date?: string | null
          id?: string
          mating_method?: string | null
          notes?: string | null
          pregnancy_confirmation_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "breeding_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      feeding_records: {
        Row: {
          animal_id: string
          cost: number | null
          created_at: string
          date: string
          deleted_at: string | null
          feed_type: string
          id: string
          notes: string | null
          quantity: number | null
          source_of_feed: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          animal_id: string
          cost?: number | null
          created_at?: string
          date: string
          deleted_at?: string | null
          feed_type: string
          id?: string
          notes?: string | null
          quantity?: number | null
          source_of_feed?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          animal_id?: string
          cost?: number | null
          created_at?: string
          date?: string
          deleted_at?: string | null
          feed_type?: string
          id?: string
          notes?: string | null
          quantity?: number | null
          source_of_feed?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feeding_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      health_records: {
        Row: {
          animal_id: string
          cost: number | null
          created_at: string
          date: string
          deleted_at: string | null
          health_issue: string | null
          id: string
          next_appointment: string | null
          notes: string | null
          recovery_status: string | null
          treatment_given: string | null
          updated_at: string
          user_id: string
          vaccine_dewormer: string | null
          vet_name: string | null
        }
        Insert: {
          animal_id: string
          cost?: number | null
          created_at?: string
          date: string
          deleted_at?: string | null
          health_issue?: string | null
          id?: string
          next_appointment?: string | null
          notes?: string | null
          recovery_status?: string | null
          treatment_given?: string | null
          updated_at?: string
          user_id: string
          vaccine_dewormer?: string | null
          vet_name?: string | null
        }
        Update: {
          animal_id?: string
          cost?: number | null
          created_at?: string
          date?: string
          deleted_at?: string | null
          health_issue?: string | null
          id?: string
          next_appointment?: string | null
          notes?: string | null
          recovery_status?: string | null
          treatment_given?: string | null
          updated_at?: string
          user_id?: string
          vaccine_dewormer?: string | null
          vet_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      production_records: {
        Row: {
          am_yield: number | null
          animal_id: string
          created_at: string
          date: string
          deleted_at: string | null
          id: string
          notes: string | null
          pm_yield: number | null
          total_yield: number | null
          updated_at: string
          use_type: string | null
          user_id: string
        }
        Insert: {
          am_yield?: number | null
          animal_id: string
          created_at?: string
          date: string
          deleted_at?: string | null
          id?: string
          notes?: string | null
          pm_yield?: number | null
          total_yield?: number | null
          updated_at?: string
          use_type?: string | null
          user_id: string
        }
        Update: {
          am_yield?: number | null
          animal_id?: string
          created_at?: string
          date?: string
          deleted_at?: string | null
          id?: string
          notes?: string | null
          pm_yield?: number | null
          total_yield?: number | null
          updated_at?: string
          use_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          farm_name: string | null
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          farm_name?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          farm_name?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          animal_id: string | null
          assigned_to: string | null
          created_at: string
          description: string | null
          due_date: string
          due_time: string | null
          id: string
          photo_url: string | null
          priority: string
          reminder_date: string | null
          reminder_enabled: boolean | null
          reminder_time: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          animal_id?: string | null
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          due_time?: string | null
          id?: string
          photo_url?: string | null
          priority?: string
          reminder_date?: string | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          animal_id?: string | null
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          due_time?: string | null
          id?: string
          photo_url?: string | null
          priority?: string
          reminder_date?: string | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
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
