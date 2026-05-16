import API from "../../services/axiosInstance";
import type { LoginPayload } from "../../types/auth";




export const loginAPI = async (data: LoginPayload) => {
  const response = await API.post("/token/", data);
  return response.data;
};

export const logoutAPI = async (refresh: string) => {
  return API.post("/logout/", { refresh });
};

export const getCurrentUser = async () => {
  const res = await API.get("/users/me/");
  return res.data;
};