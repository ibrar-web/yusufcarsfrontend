import axios, { AxiosError } from "axios";

type ErrorPayload = { message?: string; error?: string };

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL && process.env.NODE_ENV !== "production") {
  // Surface an early warning in development when the API URL is misconfigured.
  // eslint-disable-next-line no-console
  console.warn("Missing NEXT_PUBLIC_API_BASE_URL; requests may fail with a Network Error.");
}

export const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorPayload>) => {
    if (error.code === "ERR_NETWORK") {
      const url = [error.config?.baseURL, error.config?.url].filter(Boolean).join("");
      const target = url || "the API";
      return Promise.reject(
        new Error(`Network request to ${target} failed. Check your connection or that the API is reachable.`)
      );
    }

    const fallbackMessage =
      "Something went wrong while communicating with the server.";
    const responseData = error.response?.data;
    const message =
      (typeof responseData === "string" ? responseData : responseData?.message) ||
      (typeof responseData === "string" ? undefined : responseData?.error) ||
      error.message ||
      fallbackMessage;
    return Promise.reject(new Error(message));
  }
);
