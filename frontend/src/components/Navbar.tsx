import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import type { RootState } from "../app/store";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);

  const { user, role, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-50 glass px-8 py-4 flex justify-between items-center">
      {/* Brand */}
      <div onClick={() => navigate("/dashboard")} className="flex items-center gap-3 cursor-pointer group">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
          <span className="text-white font-black text-xl italic">B</span>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-black text-slate-900 tracking-tighter leading-none">
            BGV<span className="text-indigo-600">FLOW</span>
          </h1>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Enterprise</span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex gap-8 items-center">
        <div className="hidden md:flex gap-8 border-r border-slate-200 pr-8 mr-2">
          <NavLink label="Dashboard" active={isActive("/dashboard")} onClick={() => navigate("/dashboard")} />
          <NavLink label="Analytics" active={isActive("/analytics")} onClick={() => navigate("/analytics")} />
        </div>

        {/* User Action */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-100 transition-all"
          >
            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-[12px] font-black text-white shadow-md uppercase">
              {user?.username?.charAt(0) || "U"}
            </div>
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 mt-4 w-64 bg-white rounded-[24px] shadow-2xl border border-slate-100 p-6 z-20 animate-in fade-in slide-in-from-top-2">
                <div className="text-center border-b border-slate-50 pb-4 mb-4">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{role || "Operator"}</p>
                  <p className="text-sm font-black text-slate-900 truncate">{user?.username}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-rose-50 text-rose-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-colors"
                >
                  Logout System
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
        active ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
      }`}
    >
      {label}
      {active && (
        <span className="absolute -bottom-[21px] left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
      )}
    </button>
  );
}