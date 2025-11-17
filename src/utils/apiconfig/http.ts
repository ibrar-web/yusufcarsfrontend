import axios from "axios";
console.log(
  "process.env.NEXT_PUBLIC_API_BASE_URL :",
  process.env.NEXT_PUBLIC_API_BASE_URL
);
export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const fallbackMessage =
      "Something went wrong while communicating with the server.";
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      fallbackMessage;
    return Promise.reject(new Error(message));
  }
);
