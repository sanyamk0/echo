import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

export const sendOtp = (data) => api.post("/api/auth/send-otp", data);
export const verifyOtp = (data) => api.post("/api/auth/verify-otp", data);
export const activate = (data) => api.post("/api/auth/activate", data);
export const logout = () => api.get("/api/auth/logout");

// Interceptors
api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await axios.get(`${import.meta.env.VITE_CLIENT_URL}/api/auth/refresh`, {
          withCredentials: true,
        });
        return api.request(originalRequest);
      } catch (err) {
        console.log(err.message);
      }
    }
    throw error;
  }
);

export default api;
