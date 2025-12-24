import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig, Method } from "axios";
import { environment } from "@/utils/environment";

type ErrorPayload = { message?: string; error?: string };

const BASE_URL = environment.apiBaseUrl;

if (!BASE_URL && environment.isDevelopment) {
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

type Data = Record<string, unknown> | FormData | undefined;

async function request<T>(
  method: Method,
  url: string,
  data?: Data,
  config?: AxiosRequestConfig
) {
  const response = await http.request<T>({
    method,
    url,
    data,
    ...config,
  });
  return response.data;
}

export const apiGet = <T>(url: string, config?: AxiosRequestConfig) =>
  request<T>("get", url, undefined, config);

export const apiPost = <T>(
  url: string,
  data?: Data,
  config?: AxiosRequestConfig
) => request<T>("post", url, data, config);

export const apiPut = <T>(url: string, data?: Data, config?: AxiosRequestConfig) =>
  request<T>("put", url, data, config);

export const apiPatch = <T>(
  url: string,
  data?: Data,
  config?: AxiosRequestConfig
) => request<T>("patch", url, data, config);

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig) =>
  request<T>("delete", url, undefined, config);
