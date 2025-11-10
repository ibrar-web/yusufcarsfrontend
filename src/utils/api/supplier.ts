import { apiClient } from "./axios-instance";

export const supplierApi = {
  getEnquiries() {
    return apiClient.get("/supplier/enquiries");
  },
  updateProfile(payload: Record<string, unknown>) {
    return apiClient.put("/supplier/profile", payload);
  },
};
