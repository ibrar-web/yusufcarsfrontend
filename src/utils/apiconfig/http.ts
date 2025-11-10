import axios from "axios";

const DEFAULT_BASE_URL = "http://localhost:4000/api/v1";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const fallbackMessage = "Something went wrong while communicating with the server.";
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      fallbackMessage;
    return Promise.reject(new Error(message));
  },
);
