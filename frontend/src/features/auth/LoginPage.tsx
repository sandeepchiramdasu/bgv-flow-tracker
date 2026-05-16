import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./authSlice";
import type { AppDispatch, RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    // ✅ CLIENT VALIDATION
    if (!form.username.trim() || !form.password.trim()) {
      setError("Username and password are required");
      return;
    }

    try {
      const res = await dispatch(loginUser(form));

      if (res.meta.requestStatus === "fulfilled") {
        navigate("/dashboard");
      } else {
        // 🔥 INVALID CREDENTIALS
        setError("Invalid username or password");
      }
    } catch (err) {
      // 🔥 NETWORK ERROR
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-4">
      <div className="w-full max-w-[400px]">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-indigo-600 rounded-[20px] flex items-center justify-center shadow-2xl shadow-indigo-200 rotate-3">
            <span className="text-white font-black text-2xl italic">B</span>
          </div>
          <h1 className="mt-6 text-2xl font-black text-slate-900 tracking-tight">
            BGV FLOW
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Verification Management System
          </p>
        </div>

        {/* CARD */}
        <div className="card-modern p-8 bg-white">
          <form onSubmit={handleLogin} className="space-y-6">

            {/* USERNAME */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="input-field"
                onChange={(e) => {
                  setForm({ ...form, username: e.target.value });
                  setError(null); // 🔥 clear error while typing
                }}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input-field"
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setError(null);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-500 uppercase hover:text-indigo-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* ❌ ERROR ALERT */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-rose-600 animate-pulse" />
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-2xl text-sm font-bold hover:bg-indigo-600 hover:-translate-y-0.5 transition-all active:scale-95 disabled:bg-slate-200 shadow-xl shadow-slate-200"
            >
              {loading ? "Verifying Credentials..." : "Access Dashboard"}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] font-bold text-slate-400 mt-10 uppercase tracking-[0.2em]">
          Internal Enterprise System &copy; 2026
        </p>
      </div>
    </div>
  );
}