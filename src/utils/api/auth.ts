import { apiClient, authEndpoints } from "./axios-instance";

export type UserRole = "user" | "supplier" | "admin";

export interface SignupPayload {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  password: string;
  role: UserRole;
  marketingOptIn?: boolean;
}

export interface SignupResponse {
  message: string;
  userId?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  async signup(payload: SignupPayload) {
    const { data } = await apiClient.post<SignupResponse>(authEndpoints.signup, payload);
    return data;
  },
  async login(payload: LoginPayload) {
    const { data } = await apiClient.post(authEndpoints.login, payload);
    return data;
  },
};
