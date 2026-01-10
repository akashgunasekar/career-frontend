import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

// Add request interceptor to include auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("authUser");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default API;
