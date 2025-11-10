import { apiGet } from "./axios-instance";
import { apiRoutes } from "@/utils/apiroutes";

export const userApi = {
  getNotifications() {
    return apiGet(apiRoutes.user.notifications);
  },
  getOrders() {
    return apiGet(apiRoutes.user.orders);
  },
};
