import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set up Supabase connection.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      dishes: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          is_available: boolean;
          is_featured: boolean;
          prep_time_minutes: number;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          description?: string;
          price: number;
          image_url?: string;
          is_available?: boolean;
          is_featured?: boolean;
          prep_time_minutes?: number;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          description?: string;
          price?: number;
          image_url?: string;
          is_available?: boolean;
          is_featured?: boolean;
          prep_time_minutes?: number;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          queue_number: number;
          total_amount: number;
          status: string;
          payment_status: string;
          payment_method: string | null;
          customer_name: string | null;
          customer_phone: string | null;
          table_number: string | null;
          special_instructions: string | null;
          estimated_ready_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          queue_number?: number;
          total_amount: number;
          status?: string;
          payment_status?: string;
          payment_method?: string;
          customer_name?: string;
          customer_phone?: string;
          table_number?: string;
          special_instructions?: string;
          estimated_ready_time?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          queue_number?: number;
          total_amount?: number;
          status?: string;
          payment_status?: string;
          payment_method?: string;
          customer_name?: string;
          customer_phone?: string;
          table_number?: string;
          special_instructions?: string;
          estimated_ready_time?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          dish_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          special_instructions: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          dish_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          special_instructions?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          dish_id?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          special_instructions?: string;
          created_at?: string;
        };
      };
    };
  };
}