import axios from "axios";
import { API_BASE_URL, TOKEN_NAME } from "../config/constant";

const axiosApi = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

axiosApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const GET = (url, config = {}) =>
  axiosApi
    .get(url, config)
    .then((res) => res)
    .catch((error) => {
      console.error("GET request error:", error);
      throw error;
    });

export const POST = (url, data, config = {}) =>
  axiosApi
    .post(url, data, config)
    .then((res) => res)
    .catch((error) => {
      console.error("POST request error:", error);
      throw error;
    });

export const PUT = (url, data, config = {}) =>
  axiosApi
    .put(url, data, config)
    .then((res) => res)
    .catch((error) => {
      console.error("PUT request error:", error);
      throw error;
    });

export const DELETE = (url, config = {}) =>
  axiosApi
    .delete(url, config)
    .then((res) => res)
    .catch((error) => {
      console.error("DELETE request error:", error);
      throw error;
    });

// Optional: export the instance if needed
export { axiosApi };
