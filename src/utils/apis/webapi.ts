/**
 * Web API - Public/Guest APIs
 * Endpoints for unauthenticated users and public pages
 */

import { apiRequest } from '../apicalling';

// Types
export interface VehicleLookupData {
  registration: string;
  postcode?: string;
}

export interface VehicleInfo {
  registration: string;
  make: string;
  model: string;
  year: number;
  fuelType: string;
  engineSize: string;
  color?: string;
}

export interface ManualVehicleData {
  make: string;
  model: string;
  year: number;
  fuelType: string;
  engineSize: string;
  postcode?: string;
}

export interface PartRequest {
  vehicleInfo: VehicleInfo | ManualVehicleData;
  partCategory: string;
  partName?: string;
  description?: string;
  condition?: 'new' | 'used' | 'refurbished';
  urgency?: 'standard' | 'urgent';
  images?: string[];
  localRequest?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  responseTime: string;
  image?: string;
  verified: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}

/**
 * Web API Class
 */
class WebAPI {
  /**
   * Look up vehicle by registration number
   */
  async lookupVehicle(data: VehicleLookupData) {
    return apiRequest<VehicleInfo>('post', '/vehicle/lookup', data);
  }

  /**
   * Submit part request
   */
  async submitPartRequest(data: PartRequest) {
    return apiRequest<{ requestId: string; message: string }>('post', '/parts/request', data);
  }

  /**
   * Get featured suppliers
   */
  async getFeaturedSuppliers(limit: number = 6) {
    return apiRequest<Supplier[]>('get', `/suppliers/featured?limit=${limit}`);
  }

  /**
   * Search suppliers by location and category
   */
  async searchSuppliers(params: {
    postcode?: string;
    category?: string;
    radius?: number;
    page?: number;
    limit?: number;
  }) {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString();

    return apiRequest<{ suppliers: Supplier[]; total: number; page: number }>(
      'get',
      `/suppliers/search?${queryString}`
    );
  }

  /**
   * Get supplier profile by ID
   */
  async getSupplierProfile(supplierId: string) {
    return apiRequest<Supplier>('get', `/suppliers/${supplierId}`);
  }

  /**
   * Submit contact form
   */
  async submitContactForm(data: ContactForm) {
    return apiRequest<{ message: string }>('post', '/contact', data);
  }

  /**
   * Subscribe to newsletter
   */
  async subscribeNewsletter(email: string) {
    return apiRequest<{ message: string }>('post', '/newsletter/subscribe', { email });
  }

  /**
   * Get parts categories
   */
  async getPartsCategories() {
    return apiRequest<{ id: string; name: string; count: number; icon: string }[]>(
      'get',
      '/parts/categories'
    );
  }

  /**
   * Get featured parts
   */
  async getFeaturedParts(limit: number = 8) {
    return apiRequest<any[]>('get', `/parts/featured?limit=${limit}`);
  }

  /**
   * Search parts
   */
  async searchParts(params: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    page?: number;
    limit?: number;
  }) {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString();

    return apiRequest<{ parts: any[]; total: number; page: number }>(
      'get',
      `/parts/search?${queryString}`
    );
  }
}

export const webAPI = new WebAPI();
