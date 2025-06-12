import axios, { type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          const interval = setInterval(() => {
            const accessToken = Cookies.get("accessToken");
            if (accessToken) {
              clearInterval(interval);
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }
              resolve(axiosInstance(originalRequest));
            }
          }, 100);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const refreshToken = Cookies.get("refreshToken");
          const response = await axios.post(`${BASE_URL}/user/refresh-access-token`, { refreshToken }, {
            withCredentials: true, 
          });
          

          const newAccessToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;

          Cookies.set("accessToken", newAccessToken);
          Cookies.set("refreshToken", newRefreshToken);

          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          }

          resolve(axiosInstance(originalRequest));
        } catch (err) {
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    } else if (error.response?.status === 401) {
      window.alert("Please Log In again..");
      localStorage.clear();
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      console.log("Redirected..");
      window.location.href = import.meta.env.VITE_LOGIN_URL as string;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
