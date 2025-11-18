import { apiRoutes } from "@/utils/apiroutes";
import { apiPost } from "../apiconfig/client";

export type UserRole = "user" | "supplier" | "admin" | "";

export interface CustomerSignupPayload {
  fullName: string;
  email: string;
  phone: string;
  postCode: string;
  password: string;
  role: UserRole;
  marketingOptIn?: boolean;
}

export interface SupplierSignupPayload {
  role: "supplier";
  email: string;
  phone: string;
  firstName?: string;
  contactPostcode: string;
  businessName: string;
  fullName?: string;
  tradingAs?: string;
  businessType: string;
  vatNumber?: string;
  description?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  serviceRadius: string | number;
  categories: string[];
  companyRegDoc: File | null;
  insuranceDoc: File | null;
  termsAccepted: boolean;
  gdprConsent: boolean;
  password: string;
}

export type SignupPayload = CustomerSignupPayload | SupplierSignupPayload;
export type SignupRequest = SignupPayload | FormData;

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

function buildSupplierFormData(payload: SupplierSignupPayload) {
  const formData = new FormData();
  const computedFullName = payload.fullName ?? payload.businessName;

  const appendValue = (key: string, value: unknown) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((entry) => appendValue(`${key}[]`, entry));
      return;
    }
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }
    formData.append(key, String(value));
  };

  Object.entries(payload).forEach(([key, value]) => appendValue(key, value));
  appendValue("firstName", payload.firstName);
  appendValue("fullName", computedFullName);

  return formData;
}

function isSupplierPayload(
  payload: SignupRequest
): payload is SupplierSignupPayload {
  return (
    typeof payload === "object" &&
    "role" in payload &&
    payload.role === "supplier"
  );
}

function isFormDataPayload(payload: SignupRequest): payload is FormData {
  return typeof FormData !== "undefined" && payload instanceof FormData;
}

export const authApi = {
  async signup(payload: SignupRequest) {
    console.log("SignupPayload :", payload);

    const body = (() => {
      if (isFormDataPayload(payload)) return payload;
      if (isSupplierPayload(payload)) return buildSupplierFormData(payload);
      return payload;
    })();

    const config =
      isFormDataPayload(body) || isSupplierPayload(payload)
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined;

    return apiPost<SignupResponse>(apiRoutes.auth.signup, body, config);
  },
  async login(payload: LoginPayload) {
    return apiPost<LoginResponse>(apiRoutes.auth.login, payload);
  },
};
