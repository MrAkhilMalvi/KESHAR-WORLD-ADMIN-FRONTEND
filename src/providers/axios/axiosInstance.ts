import axios from "axios";
import { unauthorizedInterceptor } from "./interceptors";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor — Attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor — Store token if returned
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    const headerToken = response.headers["x-auth-token"];
    if (headerToken) {
      localStorage.setItem("token", headerToken);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// ✅ Plug in custom unauthorized + rate-limit handler
unauthorizedInterceptor(axiosInstance);

export default axiosInstance;
