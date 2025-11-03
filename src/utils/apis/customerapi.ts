/**
 * Customer API
 * Endpoints for authenticated customer users
 */

import { apiRequest } from '../apicalling';

// Types
export interface Quote {
  id: string;
  supplierId: string;
  supplierName: string;
  partName: string;
  price: number;
  originalPrice?: number;
  condition: 'new' | 'used' | 'refurbished';
  warranty: string;
  deliveryTime: string;
  deliveryFee: number;
  images?: string[];
  description?: string;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

export interface RequestDetails {
  id: string;
  vehicleInfo: any;
  partCategory: string;
  partName?: string;
  description?: string;
  status: 'pending' | 'quoted' | 'accepted' | 'completed' | 'cancelled';
  quotes: Quote[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'supplier';
  message: string;
  attachments?: string[];
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  supplierId: string;
  supplierName: string;
  quoteId?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  status: 'active' | 'archived';
}

export interface Order {
  id: string;
  quoteId: string;
  supplierId: string;
  supplierName: string;
  partName: string;
  price: number;
  deliveryFee: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  trackingNumber?: string;
  orderedAt: string;
  estimatedDelivery?: string;
}

export interface Notification {
  id: string;
  type: 'quote_received' | 'message' | 'order_update' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

/**
 * Customer API Class
 */
class CustomerAPI {
  /**
   * Get all customer requests
   */
  async getRequests(params?: { status?: string; page?: number; limit?: number }) {
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';

    return apiRequest<{ requests: RequestDetails[]; total: number; page: number }>(
      'get',
      `/customer/requests${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get request details by ID
   */
  async getRequestDetails(requestId: string) {
    return apiRequest<RequestDetails>('get', `/customer/requests/${requestId}`);
  }

  /**
   * Get quotes for a request
   */
  async getQuotes(requestId?: string) {
    return apiRequest<Quote[]>('get', `/customer/quotes${requestId ? `?requestId=${requestId}` : ''}`);
  }

  /**
   * Accept a quote
   */
  async acceptQuote(quoteId: string, deliveryAddress: string) {
    return apiRequest<{ orderId: string; message: string }>('post', `/customer/quotes/${quoteId}/accept`, {
      deliveryAddress,
    });
  }

  /**
   * Reject a quote
   */
  async rejectQuote(quoteId: string, reason?: string) {
    return apiRequest<{ message: string }>('post', `/customer/quotes/${quoteId}/reject`, { reason });
  }

  /**
   * Get all conversations
   */
  async getConversations() {
    return apiRequest<Conversation[]>('get', '/customer/conversations');
  }

  /**
   * Get conversation messages
   */
  async getMessages(conversationId: string) {
    return apiRequest<Message[]>('get', `/customer/conversations/${conversationId}/messages`);
  }

  /**
   * Send a message
   */
  async sendMessage(conversationId: string, message: string, attachments?: string[]) {
    return apiRequest<Message>('post', `/customer/conversations/${conversationId}/messages`, {
      message,
      attachments,
    });
  }

  /**
   * Mark messages as read
   */
  async markMessagesRead(conversationId: string) {
    return apiRequest<{ message: string }>('post', `/customer/conversations/${conversationId}/read`);
  }

  /**
   * Get order history
   */
  async getOrders(params?: { status?: string; page?: number; limit?: number }) {
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';

    return apiRequest<{ orders: Order[]; total: number; page: number }>(
      'get',
      `/customer/orders${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get order details
   */
  async getOrderDetails(orderId: string) {
    return apiRequest<Order>('get', `/customer/orders/${orderId}`);
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string, reason?: string) {
    return apiRequest<{ message: string }>('post', `/customer/orders/${orderId}/cancel`, { reason });
  }

  /**
   * Submit a review
   */
  async submitReview(orderId: string, rating: number, comment?: string) {
    return apiRequest<{ message: string }>('post', `/customer/orders/${orderId}/review`, {
      rating,
      comment,
    });
  }

  /**
   * Get notifications
   */
  async getNotifications(params?: { unreadOnly?: boolean; page?: number; limit?: number }) {
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';

    return apiRequest<{ notifications: Notification[]; total: number; unreadCount: number }>(
      'get',
      `/customer/notifications${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(notificationId: string) {
    return apiRequest<{ message: string }>('post', `/customer/notifications/${notificationId}/read`);
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead() {
    return apiRequest<{ message: string }>('post', '/customer/notifications/read-all');
  }

  /**
   * Get customer profile
   */
  async getProfile() {
    return apiRequest<any>('get', '/customer/profile');
  }

  /**
   * Update customer profile
   */
  async updateProfile(data: any) {
    return apiRequest<{ message: string }>('put', '/customer/profile', data);
  }

  /**
   * Update delivery address
   */
  async updateDeliveryAddress(address: string) {
    return apiRequest<{ message: string }>('put', '/customer/profile/address', { address });
  }
}

export const customerAPI = new CustomerAPI();
