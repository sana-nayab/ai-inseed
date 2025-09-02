import { supabaseService } from '../services/supabaseService';
import { supabase } from '../lib/supabase';
import { CartItem } from '../types';

export interface CreateOrderRequest {
  items: CartItem[];
  total: number;
  customerName?: string;
  tableNumber?: number;
}

export interface OrderResponse {
  id: string;
  queueNumber: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
  total: number;
  estimatedTime?: number;
}

export const orderService = {
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    try {
      // Check if Supabase is properly configured and tables exist
      if (!supabase.supabaseUrl || !supabase.supabaseKey || supabase.supabaseUrl.includes('your-project')) {
        // Return mock order for demo purposes
        return {
          id: `mock-${Date.now()}`,
          queueNumber: Math.floor(Math.random() * 50) + 1,
          status: 'pending',
          total: orderData.total,
          estimatedTime: 15
        };
      }

      // Check if database tables exist
      const isSetup = await checkIfDatabaseIsSetup();
      if (!isSetup) {
        // Return mock order for demo purposes
        return {
          id: `mock-${Date.now()}`,
          queueNumber: Math.floor(Math.random() * 50) + 1,
          status: 'pending',
          total: orderData.total,
          estimatedTime: 15
        };
      }

      const response = await supabaseService.createOrder(orderData);
      return response;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw new Error('Failed to create order. Please try again.');
    }
  },

  async getOrderStatus(orderId: string): Promise<OrderResponse> {
    try {
      // Check if this is a mock order
      if (orderId.startsWith('mock-')) {
        return {
          id: orderId,
          queueNumber: Math.floor(Math.random() * 50) + 1,
          status: 'ready',
          total: 0,
          estimatedTime: 0
        };
      }

      const response = await supabaseService.getOrder(orderId);
      return response;
    } catch (error) {
      console.error('Failed to get order status:', error);
      throw new Error('Failed to get order status. Please try again.');
    }
  }
};

async function checkIfDatabaseIsSetup(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('categories')
      .select('id')
      .limit(1);
    
    return !error;
  } catch (error) {
    return false;
  }
}