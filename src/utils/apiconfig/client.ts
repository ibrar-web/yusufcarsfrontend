import type { AxiosRequestConfig, Method } from "axios";
import { http } from "./http";

type Data = Record<string, unknown> | FormData | undefined;

async function request<T>(
  method: Method,
  url: string,
  data?: Data,
  config?: AxiosRequestConfig,
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

export const apiPost = <T>(url: string, data?: Data, config?: AxiosRequestConfig) =>
  request<T>("post", url, data, config);

export const apiPut = <T>(url: string, data?: Data, config?: AxiosRequestConfig) =>
  request<T>("put", url, data, config);

export const apiPatch = <T>(url: string, data?: Data, config?: AxiosRequestConfig) =>
  request<T>("patch", url, data, config);

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig) =>
  request<T>("delete", url, undefined, config);
