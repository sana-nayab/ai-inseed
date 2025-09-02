const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - check your connection');
      }
      throw error;
    }
  }

  // Menu API
  async getMenu() {
    return this.request('/api/menu');
  }

  async getCategories() {
    return this.request('/api/menu/categories');
  }

  // Orders API
  async createOrder(orderData: {
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      description?: string;
    }>;
    customerInfo?: {
      name?: string;
      table?: string;
    };
  }) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(orderId: string) {
    return this.request(`/api/orders/${orderId}`);
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getOrders(filters: { status?: string; date?: string } = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.date) params.append('date', filters.date);
    
    const query = params.toString();
    return this.request(`/api/orders${query ? `?${query}` : ''}`);
  }

  // Payments API
  async initiatePayment(orderId: string, amount: number) {
    return this.request('/api/payments/initiate', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();