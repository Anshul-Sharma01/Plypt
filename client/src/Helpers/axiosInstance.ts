import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && config.headers) {
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const axiosError = error as AxiosError;
    const originalRequest = axiosError.config as InternalAxiosRequestConfig & { _retry?: boolean } | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (axiosError.response?.status === 403 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for token refresh and retry original request
        return new Promise<AxiosResponse>((resolve) => {
          const interval = setInterval(() => {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
              clearInterval(interval);
              if (originalRequest.headers) {
                (originalRequest.headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
              }
              resolve(axiosInstance(originalRequest));
            }
          }, 100);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise<AxiosResponse>(async (resolve, reject) => {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("No refresh token available");

          const response = await axiosInstance.post<RefreshTokenResponse>(
            "/user/refresh-token",
            { refreshToken }
          );

          const newAccessToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;

          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          if (originalRequest.headers) {
            (originalRequest.headers as Record<string, string>)["Authorization"] = `Bearer ${newAccessToken}`;
          }

          resolve(axiosInstance(originalRequest));
        } catch (err) {
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    } else if (axiosError.response?.status === 401) {
      window.alert("Please Log In again..");
      localStorage.clear();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      console.log("Redirected..");
      window.location.href = import.meta.env.VITE_LOGIN_URL as string;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
