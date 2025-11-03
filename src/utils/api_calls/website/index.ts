import { apiRequest } from '../../apicalling';
import { API_ROUTES } from '../../api_config/api_routes';

export class WebsiteAPI {
  lookupVehicle(data: any) {
    return apiRequest('post', API_ROUTES.website.vehicleLookup, data);
  }

  submitPartRequest(data: any) {
    return apiRequest('post', API_ROUTES.website.partsRequest, data);
  }

  getFeaturedSuppliers(limit: number = 6) {
    return apiRequest('get', `${API_ROUTES.website.suppliersFeatured}?limit=${limit}`);
  }

  searchSuppliers(params: Record<string, string | number | boolean | undefined>) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
    ).toString();
    return apiRequest('get', `${API_ROUTES.website.suppliersSearch}?${qs}`);
  }

  getSupplierProfile(supplierId: string) {
    return apiRequest('get', API_ROUTES.website.supplierById(supplierId));
  }

  submitContactForm(data: any) {
    return apiRequest('post', API_ROUTES.website.contact, data);
  }

  subscribeNewsletter(email: string) {
    return apiRequest('post', API_ROUTES.website.newsletterSubscribe, { email });
  }

  getPartsCategories() {
    return apiRequest('get', API_ROUTES.website.partsCategories);
  }

  getFeaturedParts(limit: number = 8) {
    return apiRequest('get', `${API_ROUTES.website.partsFeatured}?limit=${limit}`);
  }

  searchParts(params: Record<string, string | number | boolean | undefined>) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
    ).toString();
    return apiRequest('get', `${API_ROUTES.website.partsSearch}?${qs}`);
  }
}

export const webAPI = new WebsiteAPI();


