import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;


export const privateAPI = axios.create({
  baseURL: API_BASE,
});

privateAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const publicAPI = axios.create({
  baseURL: API_BASE,
});

export default privateAPI;