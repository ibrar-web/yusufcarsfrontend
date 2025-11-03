import { apiRequest } from '../../apicalling';
import { API_ROUTES } from '../../api_config/api_routes';

export class SupplierAPI {
  submitOnboarding(data: any) {
    return apiRequest('post', API_ROUTES.supplier.onboarding, data);
  }

  getDashboardStats() {
    return apiRequest('get', API_ROUTES.supplier.dashboardStats);
  }

  getEnquiries(params?: Record<string, string | number | boolean | undefined>) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiRequest('get', `${API_ROUTES.supplier.enquiries}${qs ? `?${qs}` : ''}`);
  }

  getEnquiryDetails(enquiryId: string) {
    return apiRequest('get', API_ROUTES.supplier.enquiryById(enquiryId));
  }

  submitQuote(data: any) {
    return apiRequest('post', API_ROUTES.supplier.quotes, data);
  }

  getQuotes(params?: Record<string, string | number | boolean | undefined>) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiRequest('get', `${API_ROUTES.supplier.quotes}${qs ? `?${qs}` : ''}`);
  }

  updateQuote(quoteId: string, data: any) {
    return apiRequest('put', API_ROUTES.supplier.quoteById(quoteId), data);
  }

  withdrawQuote(quoteId: string, reason?: string) {
    return apiRequest('post', API_ROUTES.supplier.quoteWithdraw(quoteId), { reason });
  }

  getConversations() {
    return apiRequest('get', API_ROUTES.supplier.conversations);
  }

  getMessages(conversationId: string) {
    return apiRequest('get', API_ROUTES.supplier.conversationMessages(conversationId));
  }

  sendMessage(conversationId: string, message: string, attachments?: string[]) {
    return apiRequest('post', API_ROUTES.supplier.conversationMessages(conversationId), { message, attachments });
  }

  getOrders(params?: Record<string, string | number | boolean | undefined>) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiRequest('get', `${API_ROUTES.supplier.orders}${qs ? `?${qs}` : ''}`);
  }

  updateOrderStatus(orderId: string, status: 'confirmed' | 'dispatched' | 'delivered', trackingNumber?: string) {
    return apiRequest('post', API_ROUTES.supplier.orderStatus(orderId), { status, trackingNumber });
  }

  getProfile() {
    return apiRequest('get', API_ROUTES.supplier.profile);
  }

  updateProfile(data: any) {
    return apiRequest('put', API_ROUTES.supplier.profile, data);
  }

  updateBusinessHours(hours: any) {
    return apiRequest('put', API_ROUTES.supplier.profileHours, { hours });
  }

  uploadDocument(formData: FormData) {
    return apiRequest('post', API_ROUTES.supplier.documents, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  getAnalytics(params?: Record<string, string | number | boolean | undefined>) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiRequest('get', `${API_ROUTES.supplier.analytics}${qs ? `?${qs}` : ''}`);
  }

  getReviews(params?: Record<string, string | number | boolean | undefined>) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiRequest('get', `${API_ROUTES.supplier.reviews}${qs ? `?${qs}` : ''}`);
  }
}

export const supplierAPI = new SupplierAPI();


