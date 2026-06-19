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
          user_id: string;
          name: string;
          tier?: string | null;
        };
        Update: {
          name?: string;
          tier?: string | null;
        };
      };
      recipes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          output_item: string;
          output_quantity: number;
          icon_url: string | null;
          version: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          output_item: string;
          output_quantity: number;
          icon_url?: string | null;
          version?: string;
        };
        Update: {
          name?: string;
          output_item?: string;
          output_quantity?: number;
          icon_url?: string | null;
          updated_at?: string;
        };
      };
      recipe_variants: {
        Row: {
          id: string;
          recipe_id: string;
          variant_index: number;
          inputs: { item: string; quantity: number }[];
          machines: string[];
          efficiency_score: number | null;
          created_at: string;
        };
        Insert: {
          recipe_id: string;
          variant_index: number;
          inputs: { item: string; quantity: number }[];
          machines: string[];
          efficiency_score?: number | null;
        };
        Update: {
          inputs?: { item: string; quantity: number }[];
          machines?: string[];
          efficiency_score?: number | null;
        };
      };
      calculation_history: {
        Row: {
          id: string;
          user_id: string;
          item_name: string;
          quantity: number;
          selected_recipe_variants: Record<string, string> | null;
          raw_materials: Record<string, number>;
          crafting_steps: unknown[];
          created_at: string;
          accessed_at: string;
        };
        Insert: {
          user_id: string;
          item_name: string;
          quantity: number;
          raw_materials: Record<string, number>;
          crafting_steps: unknown[];
          selected_recipe_variants?: Record<string, string> | null;
        };
        Update: {
          accessed_at?: string;
        };
      };
    };
  };
}
