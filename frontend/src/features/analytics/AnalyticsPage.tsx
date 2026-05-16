import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAnalytics } from "./analyticsSlice";
import type { AppDispatch, RootState } from "../../app/store";
import MainLayout from "../../layouts/MainLayout";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from "recharts";

export default function AnalyticsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data, loading } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  if (loading || !data) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  const chartData = [
    { name: "Identity", value: data.status_distribution?.identity_check || 0 },
    { name: "Employment", value: data.status_distribution?.employment_check || 0 },
    { name: "Final Report", value: data.status_distribution?.final_report || 0 },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
            >
              ← Back to Pipeline
            </button>
            <h2 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
              System <span className="text-indigo-600">Analytics</span>
            </h2>
          </div>
        </div>

        {/* KPI STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Candidates" value={data.total_candidates} color="indigo" />
          <StatCard title="Active Delays" value={data.delayed_in_progress} color="rose" />
          <StatCard title="SLA Breached" value={data.delayed_completed} color="amber" />
          <StatCard title="Avg TAT" value={`${data.average_tat_hours}h`} color="emerald" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* BAR CHART SECTION */}
          <div className="lg:col-span-2 card-modern p-8 border-2 border-transparent hover:border-slate-100 transition-all duration-300">
            <div className="mb-8">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                Workload Distribution
              </h3>
              <p className="text-[11px] font-bold text-slate-400">Candidates across verification stages</p>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={45}>
                    {chartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 2 ? '#10b981' : '#4f46e5'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SLA ALERTS SIDEBAR */}
          <div className="space-y-6">
            <div className="card-modern p-6 border-l-4 border-rose-500 hover:border-l-8 transition-all duration-300">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">SLA Criticality</h4>
              {data.delayed_in_progress > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-rose-600">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                    <span className="text-sm font-black tracking-tight">{data.delayed_in_progress} Active Delays</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-bold text-emerald-600">✓ All systems within SLA</p>
              )}
            </div>

            <div className="card-modern p-6 bg-slate-900 text-white border-2 border-transparent hover:border-indigo-500/50 transition-all duration-300">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 text-indigo-400">Efficiency Note</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your average TAT of <span className="text-emerald-400 font-bold">{data.average_tat_hours} hours</span> is currently 
                {(data.average_tat_hours < 24) ? " outperforming " : " approaching "} industry benchmarks.
              </p>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

function StatCard({ title, value, color }: { title: string; value: any; color: string }) {
  const themes: any = {
    indigo: "hover:border-indigo-500/50 hover:bg-indigo-50/30 text-indigo-600",
    rose: "hover:border-rose-500/50 hover:bg-rose-50/30 text-rose-600",
    amber: "hover:border-amber-500/50 hover:bg-amber-50/30 text-amber-600",
    emerald: "hover:border-emerald-500/50 hover:bg-emerald-50/30 text-emerald-600",
  };

  const themeClass = themes[color] || themes.indigo;
  const textColor = themeClass.split(' ').pop(); 

  return (
    <div className={`
      card-modern p-6 transition-all duration-300 cursor-default group
      border-2 border-transparent hover:-translate-y-1 hover:shadow-xl
      ${themeClass.replace(textColor, '')}
    `}>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 group-hover:text-slate-500 transition-colors">
        {title}
      </p>
      <h3 className={`text-4xl font-black ${textColor} tracking-tighter`}>
        {value}
      </h3>
    </div>
  );
}