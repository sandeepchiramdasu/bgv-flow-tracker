import { useNavigate } from "react-router-dom";
import type { Candidate } from "../../types";

export default function CandidateCard({ data }: { data: Candidate }) {
  const navigate = useNavigate();

  // Mapping theme colors to SLA status
  const themeMap = {
    red: {
      border: "border-rose-500",
      text: "text-rose-600",
      ping: "bg-rose-400",
      dot: "bg-rose-500",
      bgHover: "hover:bg-rose-50/30"
    },
    yellow: {
      border: "border-amber-400",
      text: "text-amber-600",
      ping: "bg-amber-300",
      dot: "bg-amber-500",
      bgHover: "hover:bg-amber-50/30"
    },
    emerald: {
      border: "border-emerald-500",
      text: "text-emerald-600",
      ping: "bg-emerald-400",
      dot: "bg-emerald-500",
      bgHover: "hover:bg-emerald-50/30"
    }
  };

  const theme = themeMap[data.tat_status as keyof typeof themeMap] || themeMap.emerald;

  const lastModifier = data.logs && data.logs.length > 0 
    ? data.logs[0].changed_by 
    : "System";

  return (
    <div 
      onClick={() => navigate(`/candidates/${data.id}`)}
      className={`
        card-modern p-5 cursor-pointer group transition-all duration-300
        border-l-4 ${theme.border} 
        hover:border-l-[12px] ${theme.bgHover} hover:shadow-2xl hover:shadow-slate-200/50
      `}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {/* Pulsing Indicator - only active on card hover */}
            <span className="relative flex h-2 w-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${theme.ping} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.dot}`}></span>
            </span>
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight group-hover:text-slate-900">
              {data.name}
            </h4>
          </div>
          <p className="text-[10px] font-bold text-slate-400 pl-4 group-hover:pl-0 transition-all">
            {data.work_email}
          </p>
        </div>

        <div className="text-right">
          <span className={`text-xs font-black tracking-tighter ${theme.text}`}>
            {data.tat_hours}H
          </span>
          <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest">Elapsed</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-4">
        <Badge label="ID" verified={data.identity_verified} />
        <Badge label="EMP" verified={data.employment_verified} />
        {data.tat_status === 'red' && (
          <span className="text-[8px] font-black text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">
            SLA Critical
          </span>
        )}
      </div>

      {/* Footer Attribution */}
      <div className="flex justify-between items-center pt-3 border-t border-slate-50 group-hover:border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500 border border-slate-200 uppercase group-hover:bg-white transition-colors">
            {lastModifier.charAt(0)}
          </div>
          <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600">
            {lastModifier}
          </span>
        </div>
        <span className="text-[9px] font-bold text-slate-300">
          {new Date(data.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

function Badge({ label, verified }: { label: string; verified: boolean }) {
  return (
    <span className={`text-[9px] font-black px-2 py-1 rounded-md border transition-all ${
      verified 
        ? "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white" 
        : "bg-slate-50 text-slate-400 border-slate-100"
    }`}>
      {label} {verified ? "✓" : "•"}
    </span>
  );
}