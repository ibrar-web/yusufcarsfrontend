import { apiGet, apiPut } from "./axios-instance";
import { apiRoutes } from "@/utils/apiroutes";

export const supplierApi = {
  getEnquiries() {
    return apiGet(apiRoutes.supplier.enquiries);
  },
  updateProfile(payload: Record<string, unknown>) {
    return apiPut(apiRoutes.supplier.profile, payload);
  },
};
