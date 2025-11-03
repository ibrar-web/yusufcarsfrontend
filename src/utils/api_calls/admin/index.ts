import { apiRequest } from '../../apicalling';
import { API_ROUTES } from '../../api_config/api_routes';

export class AdminAPI {
  getDashboardStats() {
    return apiRequest('get', API_ROUTES.admin.dashboardStats);
  }

  getUsers(params?: Record<string, string | number | boolean | undefined>) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiRequest('get', `${API_ROUTES.admin.users}${qs ? `?${qs}` : ''}`);
  }

  getUserDetails(userId: string) {
    return apiRequest('get', API_ROUTES.admin.userById(userId));
  }

  createUser(data: any) {
    return apiRequest('post', API_ROUTES.admin.users, data);
  }

  updateUser(userId: string, data: any) {
    return apiRequest('put', API_ROUTES.admin.userById(userId), data);
  }

  suspendUser(userId: string, reason?: string) {
    return apiRequest('post', API_ROUTES.admin.userSuspend(userId), { reason });
  }

  activateUser(userId: string) {
    return apiRequest('post', API_ROUTES.admin.userActivate(userId));
  }

  deleteUser(userId: string) {
    return apiRequest('delete', API_ROUTES.admin.userById(userId));
  }

  getCustomers(params?: Record<string, string | number | boolean | undefined>) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiRequest('get', `${API_ROUTES.admin.customers}${qs ? `?${qs}` : ''}`);
  }

  getSuppliers(params?: Record<string, string | number | boolean | undefined>) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiRequest('get', `${API_ROUTES.admin.suppliers}${qs ? `?${qs}` : ''}`);
  }

  getSupplierDetails(supplierId: string) {
    return apiRequest('get', API_ROUTES.admin.supplierById(supplierId));
  }

  verifySupplier(supplierId: string, approved: boolean, notes?: string) {
    return apiRequest('post', API_ROUTES.admin.supplierVerify(supplierId), { approved, notes });
  }

  getEnquiries(params?: Record<string, string | number | boolean | undefined>) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiRequest('get', `${API_ROUTES.admin.enquiries}${qs ? `?${qs}` : ''}`);
  }

  getEnquiryDetails(enquiryId: string) {
    return apiRequest('get', API_ROUTES.admin.enquiryById(enquiryId));
  }

  getOrders(params?: Record<string, string | number | boolean | undefined>) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiRequest('get', `${API_ROUTES.admin.orders}${qs ? `?${qs}` : ''}`);
  }

  getReports(params: Record<string, string | number | boolean | undefined>) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
    ).toString();
    return apiRequest('get', `${API_ROUTES.admin.reports}?${qs}`);
  }

  exportData(params: any) {
    return apiRequest('post', API_ROUTES.admin.export, params);
  }

  getAnalytics(params?: Record<string, string | number | boolean | undefined>) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiRequest('get', `${API_ROUTES.admin.analytics}${qs ? `?${qs}` : ''}`);
  }

  getSettings() {
    return apiRequest('get', API_ROUTES.admin.settings);
  }

  updateSettings(data: any) {
    return apiRequest('put', API_ROUTES.admin.settings, data);
  }

  sendNotification(data: any) {
    return apiRequest('post', '/admin/notifications/send', data);
  }

  getSystemLogs(params?: Record<string, string | number | boolean | undefined>) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiRequest('get', `${API_ROUTES.admin.logs}${qs ? `?${qs}` : ''}`);
  }
}

export const adminAPI = new AdminAPI();


