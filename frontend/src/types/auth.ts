export interface AuthState {
  access: string | null;
  refresh: string | null;
  role: "admin" | "verifier" | "viewer" | null;
  user: { username: string } | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginPayload {
  username: string;
  password: string;
}