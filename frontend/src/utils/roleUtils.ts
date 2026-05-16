export const canVerify = (role: string | null) => {
  return role === "admin" || role === "verifier";
};

export const isAdmin = (role: string | null) => {
  return role === "admin";
};