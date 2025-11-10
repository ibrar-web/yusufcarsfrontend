import { apiClient } from "./axios-instance";

export const adminApi = {
  getDashboardOverview() {
    return apiClient.get("/admin/dashboard/overview");
  },
};
