import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCandidateThunk, fetchCandidates } from "./candidateSlice";
import type { AppDispatch, RootState } from "../../app/store";

export default function CreateCandidateModal({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.candidates);

  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    work_email: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone_number || !form.work_email) return;

    try {
      await dispatch(createCandidateThunk(form)).unwrap();
      // Refetching ensures the TAT and computed fields are fresh
      dispatch(fetchCandidates());
      onClose();
    } catch (err) {
      console.error("Failed to create candidate:", err);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* DECORATIVE TOP BAR */}
        <div className="h-2 bg-indigo-600 w-full" />

        <div className="p-8">
          {/* HEADER */}
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Add New <span className="text-indigo-600">Candidate</span>
            </h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Initiate verification workflow
            </p>
          </div>

          <form onSubmit={handleCreate} className="space-y-5">
            {/* NAME INPUT */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">
                Full Name
              </label>
              <input
                autoFocus
                type="text"
                required
                placeholder="e.g. Virat Kohli"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* EMAIL INPUT */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">
                Professional Email
              </label>
              <input
                type="email"
                required
                placeholder="viratkohli@company.com"
                value={form.work_email}
                onChange={(e) => setForm({ ...form, work_email: e.target.value })}
                className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* PHONE INPUT */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">
                Contact Number
              </label>
              <input
                type="tel"
                required
                placeholder="+91 XXXXX XXXXX"
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 disabled:bg-slate-300 transition-all shadow-lg shadow-indigo-100"
              >
                {loading ? "Registering..." : "Create Candidate Profile"}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
              >
                Discard Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}