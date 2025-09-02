import { supabase } from '../lib/supabase';
import { MenuData, MenuItem, MenuCategory, CartItem, Order } from '../types';

// Fallback dummy data for when Supabase is not connected
const FALLBACK_MENU_DATA: MenuData = {
  categories: [
    {
      id: '1',
      name: 'Coffee',
      items: [
        { id: '1', name: 'Espresso', description: 'Rich and bold espresso shot', price: 120, image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg' },
        { id: '2', name: 'Americano', description: 'Smooth espresso with hot water', price: 140, image: 'https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg' },
        { id: '3', name: 'Cappuccino', description: 'Espresso with steamed milk and foam', price: 160, image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg' },
        { id: '4', name: 'Latte', description: 'Smooth espresso with steamed milk', price: 170, image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg' }
      ]
    },
    {
      id: '2',
      name: 'Tea & Lemonade',
      items: [
        { id: '5', name: 'Green Tea', description: 'Fresh green tea leaves', price: 100, image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg' },
        { id: '6', name: 'Chamomile Tea', description: 'Relaxing herbal tea', price: 110, image: 'https://images.pexels.com/photos/230477/pexels-photo-230477.jpeg' },
        { id: '7', name: 'Fresh Lemonade', description: 'Freshly squeezed lemon juice', price: 130, image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg' },
        { id: '8', name: 'Iced Tea', description: 'Refreshing iced black tea', price: 120, image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg' }
      ]
    },
    {
      id: '3',
      name: 'Smoothies',
      items: [
        { id: '9', name: 'Mango Smoothie', description: 'Fresh mango blended with yogurt', price: 180, image: 'https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg' },
        { id: '10', name: 'Berry Blast', description: 'Mixed berries with banana', price: 190, image: 'https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg' },
        { id: '11', name: 'Green Smoothie', description: 'Spinach, apple, and banana', price: 200, image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg' }
      ]
    },
    {
      id: '4',
      name: 'Pastries',
      items: [
        { id: '12', name: 'Croissant', description: 'Buttery, flaky pastry', price: 150, image: 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg' },
        { id: '13', name: 'Chocolate Muffin', description: 'Rich chocolate chip muffin', price: 160, image: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg' },
        { id: '14', name: 'Danish Pastry', description: 'Sweet pastry with fruit filling', price: 170, image: 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg' }
      ]
    },
    {
      id: '5',
      name: 'Sandwiches',
      items: [
        { id: '15', name: 'Club Sandwich', description: 'Triple-decker with turkey and bacon', price: 320, image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg' },
        { id: '16', name: 'Grilled Cheese', description: 'Melted cheese on toasted bread', price: 220, image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg' },
        { id: '17', name: 'BLT', description: 'Bacon, lettuce, and tomato', price: 280, image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg' }
      ]
    },
    {
      id: '6',
      name: 'Salads',
      items: [
        { id: '18', name: 'Caesar Salad', description: 'Crisp romaine with parmesan', price: 250, image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg' },
        { id: '19', name: 'Garden Salad', description: 'Fresh mixed greens and vegetables', price: 220, image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg' }
      ]
    }
  ]
};

export class SupabaseService {
  public supabase = supabase;

  // Menu operations
  async getMenu(): Promise<MenuData> {
    try {
      // Check if Supabase is properly configured
      if (!supabase.supabaseUrl || !supabase.supabaseKey || supabase.supabaseUrl.includes('your-project')) {
        console.log('Supabase not configured, using fallback data');
        return FALLBACK_MENU_DATA;
      }

      // Don't attempt database calls if we know tables don't exist
      // This prevents unnecessary 404 errors in the console
      const isSetup = await this.checkIfDatabaseIsSetup();
      if (!isSetup) {
        console.log('Database tables not created yet, using fallback data');
        return FALLBACK_MENU_DATA;
      }

      // Fetch categories with their dishes
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          description,
          display_order,
          dishes (
            id,
            name,
            description,
            price,
            image_url,
            is_available,
            is_featured,
            prep_time_minutes,
            display_order
          )
        `)
        .eq('is_active', true)
        .order('display_order');

      if (categoriesError) {
        // If tables don't exist, use fallback data without throwing error
        if (categoriesError.code === 'PGRST116' || categoriesError.message.includes('schema cache')) {
          console.log('Database tables not found, using fallback data');
          return FALLBACK_MENU_DATA;
        }
        console.log('Supabase query failed, using fallback data:', categoriesError.message);
        return FALLBACK_MENU_DATA;
      }

      if (!categories) {
        console.log('No categories found, using fallback data');
        return FALLBACK_MENU_DATA;
      }

      // Transform data to match frontend types
      const transformedCategories: MenuCategory[] = categories.map(category => ({
        id: category.id,
        name: category.name,
        items: (category.dishes || [])
          .filter((dish: any) => dish.is_available)
          .sort((a: any, b: any) => a.display_order - b.display_order)
          .map((dish: any): MenuItem => ({
            id: dish.id,
            name: dish.name,
            description: dish.description,
            price: dish.price,
            image: dish.image_url,
          }))
      }));

      return { categories: transformedCategories };
    } catch (error) {
      console.error('Error fetching menu:', error);
      throw error;
    }
  }

  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, description, display_order')
        .eq('is_active', true)
        .order('display_order');

      if (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Order operations
  async createOrder(orderData: {
    items: CartItem[];
    total: number;
    customerName?: string;
    tableNumber?: string;
    specialInstructions?: string;
  }): Promise<Order> {
    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total_amount: orderData.total,
          customer_name: orderData.customerName,
          table_number: orderData.tableNumber,
          special_instructions: orderData.specialInstructions,
          status: 'pending',
          payment_status: 'pending',
        })
        .select()
        .single();

      if (orderError) {
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        dish_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }

      // Return transformed order
      return {
        id: order.id,
        items: orderData.items,
        total: order.total_amount,
        status: order.status as Order['status'],
        queueNumber: order.queue_number,
        timestamp: new Date(order.created_at).getTime(),
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrder(orderId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            dishes (
              name,
              description,
              image_url
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch order: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update order status: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async getOrders(filters: { status?: string; date?: string } = {}) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            dishes (
              name,
              description,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.date) {
        const startDate = new Date(filters.date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        
        query = query
          .gte('created_at', startDate.toISOString())
          .lt('created_at', endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    // Health check is now handled directly in ConnectionStatus component
    return { status: 'healthy', timestamp: new Date().toISOString() };
  }

  private async checkIfDatabaseIsSetup(): Promise<boolean> {
    try {
      // Try a simple query to see if tables exist
      const { error } = await supabase
        .from('categories')
        .select('id')
        .limit(1);
      
      // If no error, tables exist
      return !error;
    } catch (error) {
      // Any error means tables don't exist or aren't accessible
      return false;
    }
  }
}

export const supabaseService = new SupabaseService();