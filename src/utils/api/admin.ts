import { apiGet } from "./axios-instance";
import { apiRoutes } from "@/utils/apiroutes";

export const adminApi = {
  getDashboardOverview() {
    return apiGet(apiRoutes.admin.overview);
  },
};
