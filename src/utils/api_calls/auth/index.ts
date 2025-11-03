import { apiRequest } from '../../apicalling';
import { API_ROUTES } from '../../api_config/api_routes';

export class AuthAPI {
  login(credentials: { email: string; password: string }) {
    return apiRequest('post', API_ROUTES.auth.login, credentials);
  }

  register(payload: { name: string; email: string; password: string; role?: 'customer' | 'supplier' }) {
    return apiRequest('post', API_ROUTES.auth.register, payload);
  }

  logout() {
    return apiRequest('post', API_ROUTES.auth.logout);
  }

  refresh() {
    return apiRequest('post', API_ROUTES.auth.refresh);
  }

  me() {
    return apiRequest('get', API_ROUTES.auth.me);
  }
}

export const authAPI = new AuthAPI();


