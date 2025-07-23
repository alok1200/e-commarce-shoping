import axios, { AxiosRequestConfig } from "axios";

const BASE_URL: string = `${import.meta.env.VITE_BACKEND_API_BASE_URL || ""}`;

// Helper to safely extract token from localStorage
function getAccessToken(): string | null {
  const rawData = localStorage.getItem("persist:root");
  if (!rawData) return null;

  try {
    const storage = JSON.parse(rawData);
    const currentUser = storage?.currentUser
      ? JSON.parse(storage.currentUser)
      : null;
    return currentUser?.accessToken ?? null;
  } catch (error) {
    console.error("Error parsing access token:", error);
    return null;
  }
}

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
});

userRequest.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.token = `Bearer ${token}`;
  }
  return config;
});
