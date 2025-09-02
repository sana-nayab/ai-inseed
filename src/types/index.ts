export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  prepTimeMinutes?: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  items: MenuItem[];
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
  queueNumber?: number;
  timestamp: number;
  customerName?: string;
  tableNumber?: string;
  specialInstructions?: string;
  estimatedReadyTime?: number;
}

export interface MenuData {
  categories: MenuCategory[];
}