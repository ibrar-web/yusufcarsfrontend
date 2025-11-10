import { apiClient } from "./axios-instance";

export const userApi = {
  getNotifications() {
    return apiClient.get("/user/notifications");
  },
  getOrders() {
    return apiClient.get("/user/orders");
  },
};
