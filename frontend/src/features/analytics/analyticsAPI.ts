import API from "../../services/axiosInstance";

export const getAnalytics = async () => {
  const res = await API.get("/analytics/");
  return res.data;
};