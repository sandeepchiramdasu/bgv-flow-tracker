import API from "../../services/axiosInstance";

export const verifyCandidate = async (
  id: number,
  payload: {
    identity_verified?: boolean;
    employment_verified?: boolean;
  }
) => {
  const res = await API.patch(`/verify/${id}/`, payload);
  return res.data;
};