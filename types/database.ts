export interface DatabaseProduct {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string;
  status: string;
  image_url: string | null;
  image_path: string | null;
  price: number | string | null;
  target_price: number | string | null;
  store: string | null;
  url: string | null;
  quantity: number;
  priority: string | null;
  purchase_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: DatabaseProduct;
        Insert: Omit<DatabaseProduct, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string | null;
        };
        Update: Partial<DatabaseProduct>;
        Relationships: [];
      };
      user_settings: {
        Row: {
          user_id: string;
          budget: number | string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          user_id: string;
          budget: number | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          budget?: number | null;
          updated_at?: string | null;
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
