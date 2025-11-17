import { apiPost } from "./axios-instance";
import { apiRoutes } from "@/utils/apiroutes";

export type UserRole = "user" | "supplier" | "admin" | "";

export interface SignupPayload {
  fullName: string;
  email: string;
  phone: string;
  postcode: string;
  password: string;
  role: UserRole;
  marketingOptIn?: boolean;
}

export interface SignupResponse {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginResponse {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export const authApi = {
  async signup(payload: SignupPayload) {
    console.log("SignupPayload :", payload);
    return apiPost<SignupResponse>(apiRoutes.auth.signup, payload);
  },
  async login(payload: LoginPayload) {
    return apiPost<LoginResponse>(apiRoutes.auth.login, payload);
  },
};
