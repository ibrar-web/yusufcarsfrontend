/**
 * Axios API Configuration
 * Centralized HTTP client with request/response interceptors
 */

import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Adds authentication token and handles request preparation
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authentication token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log("🚀 API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles successful responses and errors globally
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === "development") {
      console.log("✅ API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;

      console.error("❌ API Error Response:", {
        status,
        url: error.config?.url,
        message: data?.message || error.message,
      });

      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_role");
            window.location.href = "/auth";
          }
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error("Access denied");
          break;

        case 404:
          // Not found
          console.error("Resource not found");
          break;

        case 422:
          // Validation error
          console.error("Validation error:", data?.errors);
          break;

        case 500:
          // Server error
          console.error("Server error");
          break;

        default:
          console.error("Unexpected error:", status);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("❌ Network Error:", {
        message: "No response from server",
        url: error.config?.url,
      });
    } else {
      // Error in request configuration
      console.error("❌ Request Configuration Error:", error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * API Success Handler
 * Standardized success response handler
 */
export const handleApiSuccess = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

/**
 * API Error Handler
 * Standardized error handler with user-friendly messages
 */
export const handleApiError = (
  error: AxiosError
): {
  message: string;
  status?: number;
  errors?: any;
} => {
  if (error.response) {
    const data = error.response.data as any;
    return {
      message: data?.message || "An error occurred",
      status: error.response.status,
      errors: data?.errors,
    };
  } else if (error.request) {
    return {
      message: "Network error. Please check your connection.",
    };
  } else {
    return {
      message: error.message || "An unexpected error occurred",
    };
  }
};

/**
 * Typed API request wrapper with error handling
 */
export const apiRequest = async <T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: any,
  config?: any
): Promise<{
  data?: T;
  error?: { message: string; status?: number; errors?: any };
}> => {
  try {
    let response: AxiosResponse<T>;

    switch (method) {
      case "get":
        response = await apiClient.get<T>(url, config);
        break;
      case "post":
        response = await apiClient.post<T>(url, data, config);
        break;
      case "put":
        response = await apiClient.put<T>(url, data, config);
        break;
      case "patch":
        response = await apiClient.patch<T>(url, data, config);
        break;
      case "delete":
        response = await apiClient.delete<T>(url, config);
        break;
    }

    return { data: handleApiSuccess(response) };
  } catch (error) {
    return { error: handleApiError(error as AxiosError) };
  }
};

export default apiClient;
