import axios from "axios";
import { logout, loginUser } from "../stores/authSlice"; // Adjust the path based on your structure

const API_URL = "http://localhost:3310/api";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include token in headers
axiosInstance.interceptors.request.use(
  (config, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error, { getState, dispatch }) => {
    const originalRequest = error.config;
    
    // If the error is 401 (Unauthorized) and it's not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request as retried

      try {
        // Get refresh token from Redux state
        const refreshToken = getState().auth.refreshToken;

        if (!refreshToken) {
          dispatch(logout());
          return Promise.reject(error);
        }

        // Request a new access token
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });

        // Update token in Redux state
        dispatch(loginUser.fulfilled({ data })); // Manually trigger loginUser with new tokens

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
