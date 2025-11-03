/**
 * Supplier API
 * Endpoints for authenticated supplier users
 */

import { apiRequest } from '../apicalling';

// Types
export interface Enquiry {
  id: string;
  customerId: string;
  customerName?: string;
  vehicleInfo: any;
  partCategory: string;
  partName?: string;
  description?: string;
  condition?: 'new' | 'used' | 'refurbished';
  urgency?: 'standard' | 'urgent';
  images?: string[];
  location?: string;
  createdAt: string;
  status: 'new' | 'quoted' | 'accepted' | 'rejected' | 'expired';
  hasQuoted: boolean;
}

export interface SubmitQuoteData {
  enquiryId: string;
  price: number;
  originalPrice?: number;
  condition: 'new' | 'used' | 'refurbished';
  warranty: string;
  deliveryTime: string;
  deliveryFee: number;
  description?: string;
  images?: string[];
  expiryHours?: number;
}

export interface QuoteDetails {
  id: string;
  enquiryId: string;
  price: number;
  originalPrice?: number;
  condition: 'new' | 'used' | 'refurbished';
  warranty: string;
  deliveryTime: string;
  deliveryFee: number;
  description?: string;
  images?: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export interface SupplierStats {
  totalEnquiries: number;
  activeQuotes: number;
  acceptedQuotes: number;
  revenue: number;
  rating: number;
  responseTime: string;
}

export interface OnboardingData {
  businessName: string;
  businessType: 'sole_trader' | 'limited_company' | 'partnership';
  registrationNumber?: string;
  vatNumber?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    country: string;
  };
  contactPerson: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
  };
  bankDetails: {
    accountName: string;
    accountNumber: string;
    sortCode: string;
  };
  services: {
    categories: string[];
    deliveryOptions: string[];
    serviceArea: number; // radius in miles
  };
  documents: {
    businessLicense?: string;
    insurance?: string;
    certification?: string;
  };
}

export interface SupplierProfile {
  id: string;
  businessName: string;
  rating: number;
  reviews: number;
  location: string;
  responseTime: string;
  verified: boolean;
  description?: string;
  specialties: string[];
  serviceArea: number;
  deliveryOptions: string[];
  businessHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
}

/**
 * Supplier API Class
 */
class SupplierAPI {
  /**
   * Submit supplier onboarding application
   */
  async submitOnboarding(data: OnboardingData) {
    return apiRequest<{ supplierId: string; message: string }>('post', '/supplier/onboarding', data);
  }

  /**
   * Get supplier dashboard statistics
   */
  async getDashboardStats() {
    return apiRequest<SupplierStats>('get', '/supplier/dashboard/stats');
  }

  /**
   * Get supplier enquiries
   */
  async getEnquiries(params?: {
    status?: 'new' | 'quoted' | 'all';
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';

    return apiRequest<{ enquiries: Enquiry[]; total: number; page: number }>(
      'get',
      `/supplier/enquiries${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get enquiry details
   */
  async getEnquiryDetails(enquiryId: string) {
    return apiRequest<Enquiry>('get', `/supplier/enquiries/${enquiryId}`);
  }

  /**
   * Submit a quote for an enquiry
   */
  async submitQuote(data: SubmitQuoteData) {
    return apiRequest<{ quoteId: string; message: string }>('post', '/supplier/quotes', data);
  }

  /**
   * Get supplier's quotes
   */
  async getQuotes(params?: { status?: string; page?: number; limit?: number }) {
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';

    return apiRequest<{ quotes: QuoteDetails[]; total: number; page: number }>(
      'get',
      `/supplier/quotes${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Update a quote
   */
  async updateQuote(quoteId: string, data: Partial<SubmitQuoteData>) {
    return apiRequest<{ message: string }>('put', `/supplier/quotes/${quoteId}`, data);
  }

  /**
   * Withdraw a quote
   */
  async withdrawQuote(quoteId: string, reason?: string) {
    return apiRequest<{ message: string }>('post', `/supplier/quotes/${quoteId}/withdraw`, { reason });
  }

  /**
   * Get supplier conversations
   */
  async getConversations() {
    return apiRequest<any[]>('get', '/supplier/conversations');
  }

  /**
   * Get conversation messages
   */
  async getMessages(conversationId: string) {
    return apiRequest<any[]>('get', `/supplier/conversations/${conversationId}/messages`);
  }

  /**
   * Send a message
   */
  async sendMessage(conversationId: string, message: string, attachments?: string[]) {
    return apiRequest<any>('post', `/supplier/conversations/${conversationId}/messages`, {
      message,
      attachments,
    });
  }

  /**
   * Get supplier orders
   */
  async getOrders(params?: { status?: string; page?: number; limit?: number }) {
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';

    return apiRequest<{ orders: any[]; total: number; page: number }>(
      'get',
      `/supplier/orders${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: 'confirmed' | 'dispatched' | 'delivered',
    trackingNumber?: string
  ) {
    return apiRequest<{ message: string }>('post', `/supplier/orders/${orderId}/status`, {
      status,
      trackingNumber,
    });
  }

  /**
   * Get supplier profile
   */
  async getProfile() {
    return apiRequest<SupplierProfile>('get', '/supplier/profile');
  }

  /**
   * Update supplier profile
   */
  async updateProfile(data: Partial<SupplierProfile>) {
    return apiRequest<{ message: string }>('put', '/supplier/profile', data);
  }

  /**
   * Update business hours
   */
  async updateBusinessHours(hours: SupplierProfile['businessHours']) {
    return apiRequest<{ message: string }>('put', '/supplier/profile/hours', { hours });
  }

  /**
   * Upload document
   */
  async uploadDocument(file: File, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return apiRequest<{ url: string; message: string }>('post', '/supplier/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get analytics data
   */
  async getAnalytics(params?: { startDate?: string; endDate?: string; granularity?: 'day' | 'week' | 'month' }) {
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';

    return apiRequest<any>('get', `/supplier/analytics${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Get reviews
   */
  async getReviews(params?: { page?: number; limit?: number }) {
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';

    return apiRequest<{ reviews: any[]; total: number; averageRating: number }>(
      'get',
      `/supplier/reviews${queryString ? `?${queryString}` : ''}`
    );
  }
}

export const supplierAPI = new SupplierAPI();
