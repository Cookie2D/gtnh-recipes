export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
        };
        Update: {
          username?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_machines: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          tier: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          tier?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          tier?: string | null;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          output_item: string;
          icon_url: string | null;
          version: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          output_item: string;
          icon_url?: string | null;
          version?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          output_item?: string;
          icon_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      recipe_variants: {
        Row: {
          id: string;
          recipe_id: string;
          variant_index: number;
          inputs: Json;
          machines: Json;
          output_quantity: number;
          efficiency_score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          variant_index: number;
          inputs: Json;
          machines: Json;
          output_quantity?: number;
          efficiency_score?: number | null;
          created_at?: string;
        };
        Update: {
          inputs?: Json;
          machines?: Json;
          output_quantity?: number;
          efficiency_score?: number | null;
        };
        Relationships: [];
      };
      user_variant_prefs: {
        Row: {
          user_id: string;
          item_name: string;
          variant_index: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          item_name: string;
          variant_index: number;
          updated_at?: string;
        };
        Update: {
          variant_index?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      calculation_history: {
        Row: {
          id: string;
          user_id: string;
          item_name: string;
          quantity: number;
          selected_recipe_variants: Json | null;
          raw_materials: Json;
          crafting_steps: Json;
          created_at: string;
          accessed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_name: string;
          quantity: number;
          raw_materials: Json;
          crafting_steps: Json;
          selected_recipe_variants?: Json | null;
          created_at?: string;
          accessed_at?: string;
        };
        Update: {
          accessed_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
