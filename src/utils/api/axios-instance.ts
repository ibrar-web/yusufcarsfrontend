import axios from "axios";

const DEFAULT_BASE_URL = "http://localhost:4000/api/v1";
const DEFAULT_LOGIN_PATH = "/auth/login";
const DEFAULT_SIGNUP_PATH = "/auth/register";

export const authEndpoints = {
  login: process.env.NEXT_PUBLIC_AUTH_LOGIN_PATH ?? DEFAULT_LOGIN_PATH,
  signup: process.env.NEXT_PUBLIC_AUTH_SIGNUP_PATH ?? DEFAULT_SIGNUP_PATH,
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong while communicating with the server.";
    return Promise.reject(new Error(message));
  },
);
