/**
 * Admin API
 * Endpoints for authenticated admin users
 */

import { apiRequest } from '../apicalling';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'supplier' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastLoginAt?: string;
}

export interface Customer extends User {
  ordersCount: number;
  totalSpent: number;
  averageOrderValue: number;
}

export interface Supplier extends User {
  businessName: string;
  rating: number;
  reviewsCount: number;
  quotesCount: number;
  acceptanceRate: number;
  responseTime: string;
  verified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
}

export interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalSuppliers: number;
  activeEnquiries: number;
  totalQuotes: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  platformGrowth: {
    usersGrowth: number;
    revenueGrowth: number;
    ordersGrowth: number;
  };
}

export interface Enquiry {
  id: string;
  customerId: string;
  customerName: string;
  vehicleInfo: any;
  partCategory: string;
  status: 'pending' | 'quoted' | 'accepted' | 'completed' | 'cancelled';
  quotesCount: number;
  createdAt: string;
}

export interface Report {
  type: 'user' | 'supplier' | 'order' | 'revenue';
  startDate: string;
  endDate: string;
  data: any;
}

/**
 * Admin API Class
 */
class AdminAPI {
  /**
   * Get admin dashboard statistics
   */
  async getDashboardStats() {
    return apiRequest<AdminStats>('get', '/admin/dashboard/stats');
  }

  /**
   * Get all users
   */
  async getUsers(params?: {
    role?: 'customer' | 'supplier' | 'admin';
    status?: 'active' | 'suspended' | 'pending';
    search?: string;
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

    return apiRequest<{ users: User[]; total: number; page: number }>(
      'get',
      `/admin/users${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get user details
   */
  async getUserDetails(userId: string) {
    return apiRequest<User>('get', `/admin/users/${userId}`);
  }

  /**
   * Create new user
   */
  async createUser(data: {
    email: string;
    name: string;
    role: 'customer' | 'supplier' | 'admin';
    password: string;
  }) {
    return apiRequest<{ userId: string; message: string }>('post', '/admin/users', data);
  }

  /**
   * Update user
   */
  async updateUser(userId: string, data: Partial<User>) {
    return apiRequest<{ message: string }>('put', `/admin/users/${userId}`, data);
  }

  /**
   * Suspend user
   */
  async suspendUser(userId: string, reason?: string) {
    return apiRequest<{ message: string }>('post', `/admin/users/${userId}/suspend`, { reason });
  }

  /**
   * Activate user
   */
  async activateUser(userId: string) {
    return apiRequest<{ message: string }>('post', `/admin/users/${userId}/activate`);
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string) {
    return apiRequest<{ message: string }>('delete', `/admin/users/${userId}`);
  }

  /**
   * Get all customers
   */
  async getCustomers(params?: { status?: string; search?: string; page?: number; limit?: number }) {
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';

    return apiRequest<{ customers: Customer[]; total: number; page: number }>(
      'get',
      `/admin/customers${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get all suppliers
   */
  async getSuppliers(params?: {
    status?: string;
    verified?: boolean;
    search?: string;
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

    return apiRequest<{ suppliers: Supplier[]; total: number; page: number }>(
      'get',
      `/admin/suppliers${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get supplier details
   */
  async getSupplierDetails(supplierId: string) {
    return apiRequest<Supplier>('get', `/admin/suppliers/${supplierId}`);
  }

  /**
   * Verify supplier
   */
  async verifySupplier(supplierId: string, approved: boolean, notes?: string) {
    return apiRequest<{ message: string }>('post', `/admin/suppliers/${supplierId}/verify`, {
      approved,
      notes,
    });
  }

  /**
   * Get all enquiries
   */
  async getEnquiries(params?: { status?: string; category?: string; page?: number; limit?: number }) {
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';

    return apiRequest<{ enquiries: Enquiry[]; total: number; page: number }>(
      'get',
      `/admin/enquiries${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get enquiry details
   */
  async getEnquiryDetails(enquiryId: string) {
    return apiRequest<Enquiry>('get', `/admin/enquiries/${enquiryId}`);
  }

  /**
   * Get all orders
   */
  async getOrders(params?: { status?: string; search?: string; page?: number; limit?: number }) {
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';

    return apiRequest<{ orders: any[]; total: number; page: number }>(
      'get',
      `/admin/orders${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get reports
   */
  async getReports(params: {
    type: 'users' | 'suppliers' | 'orders' | 'revenue' | 'quotes';
    startDate?: string;
    endDate?: string;
    granularity?: 'day' | 'week' | 'month';
  }) {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString();

    return apiRequest<Report>('get', `/admin/reports?${queryString}`);
  }

  /**
   * Export data
   */
  async exportData(params: {
    type: 'users' | 'suppliers' | 'customers' | 'orders' | 'enquiries';
    format: 'csv' | 'excel' | 'pdf';
    filters?: any;
  }) {
    return apiRequest<{ downloadUrl: string }>('post', '/admin/export', params);
  }

  /**
   * Get platform analytics
   */
  async getAnalytics(params?: { startDate?: string; endDate?: string; granularity?: 'day' | 'week' | 'month' }) {
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';

    return apiRequest<any>('get', `/admin/analytics${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Get platform settings
   */
  async getSettings() {
    return apiRequest<any>('get', '/admin/settings');
  }

  /**
   * Update platform settings
   */
  async updateSettings(data: any) {
    return apiRequest<{ message: string }>('put', '/admin/settings', data);
  }

  /**
   * Send notification to users
   */
  async sendNotification(data: {
    recipients: 'all' | 'customers' | 'suppliers' | string[];
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'success' | 'error';
    link?: string;
  }) {
    return apiRequest<{ message: string; sentCount: number }>('post', '/admin/notifications/send', data);
  }

  /**
   * Get system logs
   */
  async getSystemLogs(params?: { level?: 'info' | 'warning' | 'error'; page?: number; limit?: number }) {
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';

    return apiRequest<{ logs: any[]; total: number; page: number }>(
      'get',
      `/admin/logs${queryString ? `?${queryString}` : ''}`
    );
  }
}

export const adminAPI = new AdminAPI();
