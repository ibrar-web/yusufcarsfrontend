import { apiRequest } from '../../apicalling';
import { API_ROUTES } from '../../api_config/api_routes';

export class CustomerAPI {
  getRequests(params?: Record<string, string | number | boolean | undefined>) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiRequest('get', `${API_ROUTES.customer.requests}${qs ? `?${qs}` : ''}`);
  }

  getRequestDetails(requestId: string) {
    return apiRequest('get', API_ROUTES.customer.requestById(requestId));
  }

  getQuotes(requestId?: string) {
    const qs = requestId ? `?requestId=${requestId}` : '';
    return apiRequest('get', `${API_ROUTES.customer.quotes}${qs}`);
  }

  acceptQuote(quoteId: string, deliveryAddress: string) {
    return apiRequest('post', API_ROUTES.customer.quoteAccept(quoteId), { deliveryAddress });
  }

  rejectQuote(quoteId: string, reason?: string) {
    return apiRequest('post', API_ROUTES.customer.quoteReject(quoteId), { reason });
  }

  getConversations() {
    return apiRequest('get', API_ROUTES.customer.conversations);
  }

  getMessages(conversationId: string) {
    return apiRequest('get', API_ROUTES.customer.conversationMessages(conversationId));
  }

  sendMessage(conversationId: string, message: string, attachments?: string[]) {
    return apiRequest('post', API_ROUTES.customer.conversationMessages(conversationId), { message, attachments });
  }

  markMessagesRead(conversationId: string) {
    return apiRequest('post', API_ROUTES.customer.conversationRead(conversationId));
  }

  getOrders(params?: Record<string, string | number | boolean | undefined>) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiRequest('get', `${API_ROUTES.customer.orders}${qs ? `?${qs}` : ''}`);
  }

  getOrderDetails(orderId: string) {
    return apiRequest('get', API_ROUTES.customer.orderById(orderId));
  }

  cancelOrder(orderId: string, reason?: string) {
    return apiRequest('post', API_ROUTES.customer.orderCancel(orderId), { reason });
  }

  submitReview(orderId: string, rating: number, comment?: string) {
    return apiRequest('post', API_ROUTES.customer.orderReview(orderId), { rating, comment });
  }

  getNotifications(params?: Record<string, string | number | boolean | undefined>) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiRequest('get', `${API_ROUTES.customer.notifications}${qs ? `?${qs}` : ''}`);
  }

  markNotificationRead(notificationId: string) {
    return apiRequest('post', API_ROUTES.customer.notificationRead(notificationId));
  }

  markAllNotificationsRead() {
    return apiRequest('post', API_ROUTES.customer.notificationsReadAll);
  }

  getProfile() {
    return apiRequest('get', API_ROUTES.customer.profile);
  }

  updateProfile(data: any) {
    return apiRequest('put', API_ROUTES.customer.profile, data);
  }

  updateDeliveryAddress(address: string) {
    return apiRequest('put', API_ROUTES.customer.profileAddress, { address });
  }
}

export const customerAPI = new CustomerAPI();


