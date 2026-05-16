import API from "../../services/axiosInstance";
import type { Candidate } from "../../types";

export const getCandidates = async (): Promise<Candidate[]> => {
  const res = await API.get("/candidates/");
  return res.data;
};

// ✅ Updated to accept the new mandatory fields
export const createCandidate = async (data: { 
  name: string; 
  phone_number: string; 
  work_email: string; 
}): Promise<Candidate> => {
  const res = await API.post("/candidates/", data);
  return res.data;
};

export const getCandidateById = async (id: number | string): Promise<Candidate> => {
  const res = await API.get(`/candidates/${id}/`);
  return res.data;
};
