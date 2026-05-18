import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCandidateById,
  clearSelectedCandidate,
  updateCandidateRemarks
} from "./candidateSlice";
import type { AppDispatch, RootState } from "../../app/store";
import MainLayout from "../../layouts/MainLayout";

export default function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selected, loading } = useSelector((state: RootState) => state.candidates);
  const role = useSelector((state: RootState) => state.auth.role);

  const canEditRemarks =
    role === "admin" || role === "verifier";

  const canViewInternalRemarks =
    role !== "viewer";

  const [isEditing, setIsEditing] = useState(false);
  const [remarksText, setRemarksText] = useState("");
 const [internalRemarksText, setInternalRemarksText] = useState("");

  useEffect(() => {
    if (id) dispatch(fetchCandidateById(Number(id)));
    return () => { dispatch(clearSelectedCandidate()); };
  }, [id, dispatch]);

  useEffect(() => {
  if (selected) {
    setRemarksText(selected.remarks || "");
    setInternalRemarksText(selected.internal_remarks || "");
  }
}, [selected]);

  if (loading || !selected) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  const tatTextColor =
    selected.tat_status === "red" ? "text-rose-600" : 
    selected.tat_status === "yellow" ? "text-amber-500" : 
    "text-emerald-600";

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Verification Time</span>
            <span className={`text-sm font-black ${tatTextColor}`}>
              {selected.tat_hours} Hours
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: PROFILE & REMARKS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card-modern p-8">
              <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center rounded-2xl font-black text-2xl mb-6">
                {selected.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selected.name}</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase mb-6 tracking-widest">ID: #{selected.id}</p>

              <div className="space-y-4 mb-8">
                <InfoRow label="Work Email" value={selected.work_email} />
                <InfoRow label="Phone" value={selected.phone_number} />
              </div>

              <div className="flex gap-2 pt-6 border-t border-slate-50">
                <Badge label="Identity" verified={selected.identity_verified} />
                <Badge label="Employment" verified={selected.employment_verified} />
              </div>
            </div>

            {/* REMARKS */}
            {/* REMARKS */}
<div className="card-modern p-8 space-y-6">

  {/* GENERAL REMARKS */}
  <div>
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Remarks
      </h4>

      {canEditRemarks && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="text-[10px] font-black text-indigo-600 uppercase"
        >
          Edit
        </button>
      )}
    </div>

    {isEditing ? (
      <textarea
        value={remarksText}
        onChange={(e) => setRemarksText(e.target.value)}
        className="w-full border border-slate-200 rounded-xl p-4 min-h-[120px] text-sm outline-none focus:border-indigo-500"
      />
    ) : (
      <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-700 whitespace-pre-wrap">
        {selected.remarks || "No remarks added"}
      </div>
    )}
  </div>

  {/* INTERNAL REMARKS */}
  {canViewInternalRemarks && (
    <div>
      <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4">
        Internal Remarks
      </h4>

      {isEditing ? (
        <textarea
          value={internalRemarksText}
          onChange={(e) => setInternalRemarksText(e.target.value)}
          className="w-full border border-rose-200 rounded-xl p-4 min-h-[120px] text-sm outline-none focus:border-rose-400 bg-rose-50/40"
        />
      ) : (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-sm text-slate-700 whitespace-pre-wrap">
          {selected.internal_remarks || "No internal remarks added"}
        </div>
      )}
    </div>
  )}

  {/* SAVE BUTTON */}
  {isEditing && canEditRemarks && (
    <div className="flex gap-3">
      <button
        onClick={async () => {
          await dispatch(
            updateCandidateRemarks({
              id: selected.id,
              remarks: remarksText,
              internal_remarks: internalRemarksText,
            })
          );

          setIsEditing(false);

          dispatch(fetchCandidateById(selected.id));
        }}
        className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm"
      >
        Save
      </button>

      <button
        onClick={() => setIsEditing(false)}
        className="px-5 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-sm"
      >
        Cancel
      </button>
    </div>
  )}
</div>
          </div>

          {/* RIGHT: TIMELINE */}
          <div className="lg:col-span-8">
            <div className="card-modern p-8">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-10">
                Activity <span className="text-indigo-600">Timeline</span>
              </h3>
              <div className="relative pl-8">
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-100" />
                <div className="space-y-12">
                  {selected.logs?.map((log, i) => (
                    <div key={i} className="relative flex gap-6 items-start">
                      <div className="absolute -left-[25px] w-4 h-4 rounded-full border-4 border-white bg-indigo-500 shadow-sm z-10" />
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {log.action.replace("_", " ")}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {log.from_status && (
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs font-bold text-slate-500">{log.from_status.replace("_", " ")}</span>
                            <span className="text-slate-300">→</span>
                            <span className="text-xs font-black text-slate-900">{log.to_status.replace("_", " ")}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                          <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-[8px] font-black text-white uppercase">
                            {log.changed_by.charAt(0)}
                          </div>
                          <p className="text-[11px] font-medium text-slate-500">
                            By <span className="font-black text-slate-900">{log.changed_by}</span>
                          </p>
                          <span className="text-[11px] text-slate-300 ml-auto">
                            {new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-900">{value || "N/A"}</p>
    </div>
  );
}

function Badge({ label, verified }: any) {
  return (
    <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border-2 ${
      verified ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
    }`}>
      {label} {verified ? "✓" : "•"}
    </span>
  );
}