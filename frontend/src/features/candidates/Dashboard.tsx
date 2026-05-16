import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCandidates } from "./candidateSlice";
import type { AppDispatch, RootState } from "../../app/store";
import type { Candidate } from "../../types";
import CandidateCard from "./CandidateCard";
import CreateCandidateModal from "./CreateCandidateModal";
import MainLayout from "../../layouts/MainLayout";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { verifyCandidate } from "../verification/verificationAPI";

type Status = "identity_check" | "employment_check" | "final_report";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [showModal, setShowModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tatFilter, setTatFilter] = useState<string>("all");

  const { list } = useSelector((state: RootState) => state.candidates);
  const role = useSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const stats = useMemo(() => ({
    total: list.length,
    atRisk: list.filter(c => c.tat_status === "red").length,
    warning: list.filter(c => c.tat_status === "yellow").length,
    completed: list.filter(c => c.status === "final_report").length,
  }), [list]);

  const filteredList = useMemo(() => {
    return list.filter((c: Candidate) => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.work_email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTat = tatFilter === "all" || c.tat_status === tatFilter;
      return matchesSearch && matchesTat;
    });
  }, [list, searchQuery, tatFilter]);

  const grouped: Record<Status, Candidate[]> = {
    identity_check: filteredList.filter(c => c.status === "identity_check"),
    employment_check: filteredList.filter(c => c.status === "employment_check"),
    final_report: filteredList.filter(c => c.status === "final_report"),
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    if (role === "viewer" || destination.droppableId === "identity_check") return;

    setIsSyncing(true);
    try {
      if (destination.droppableId === "employment_check") {
        await verifyCandidate(Number(draggableId), { identity_verified: true });
      } else if (destination.droppableId === "final_report") {
        await verifyCandidate(Number(draggableId), { employment_verified: true });
      }
      await dispatch(fetchCandidates());
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-10 pb-16">
        
        {/* KPI OVERVIEW - First two cards have no hover line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Pipeline" value={stats.total} trend="Active" color="indigo" showLine={false} />
          <StatCard title="SLA Breach" value={stats.atRisk} trend="Critical" color="rose" showLine={false} />
          <StatCard title="Near Breach" value={stats.warning} trend="Warning" color="amber" />
          <StatCard title="Completed" value={stats.completed} trend="Success" color="emerald" />
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Candidate <span className="text-indigo-600">Flow</span>
            </h2>
            <p className="text-sm font-bold text-slate-400 mt-1">Manage verification lifecycle and SLA targets.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search pipeline..." 
              className="bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl px-6 py-3 text-sm font-bold transition-all outline-none md:w-64" 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            {role === "admin" && (
              <button 
                onClick={() => setShowModal(true)}
                className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all"
              >
                + Register
              </button>
            )}
          </div>
        </div>

        {/* KANBAN BOARD */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {(Object.entries(grouped) as [Status, Candidate[]][]).map(([status, items]) => {
              const hasDelayed = items.some(c => c.tat_status === "red");

              return (
                <Droppable droppableId={status} key={status}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-5">
                      <div className="flex justify-between items-center px-4">
                        <div className="flex items-center gap-2">
                            {hasDelayed && (
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                </span>
                            )}
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                {status.replace("_", " ")}
                            </h3>
                        </div>
                        <span className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-500">
                          {items.length}
                        </span>
                      </div>

                      <div className={`
                        p-4 rounded-[40px] min-h-[650px] transition-colors duration-500
                        ${hasDelayed ? 'bg-rose-50/30 border-2 border-dashed border-rose-100' : 'bg-slate-50/50 border-2 border-dashed border-slate-200'}
                      `}>
                        <div className="space-y-4">
                          {items.map((c, index) => (
                            <Draggable key={c.id} draggableId={String(c.id)} index={index}>
                              {(p, snapshot) => (
                                <div 
                                    ref={p.innerRef} 
                                    {...p.draggableProps} 
                                    {...p.dragHandleProps}
                                    className={`${snapshot.isDragging ? 'rotate-2 scale-105 z-50' : ''} transition-transform`}
                                >
                                  <CandidateCard data={c} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {showModal && <CreateCandidateModal onClose={() => setShowModal(false)} />}
      
      {isSyncing && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-[2px] z-[100] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Syncing Pipeline...</p>
            </div>
        </div>
      )}
    </MainLayout>
  );
}

/* ============================= */
/* 🧩 INTERNAL COMPONENTS        */
/* ============================= */

function StatCard({ 
  title, 
  value, 
  trend, 
  color, 
  showLine = true 
}: { 
  title: string; 
  value: any; 
  trend: string; 
  color: string;
  showLine?: boolean; 
}) {
  const themes: any = {
    indigo: { text: "text-indigo-600", bg: "bg-indigo-50", border: "hover:border-indigo-500/50" },
    rose: { text: "text-rose-600", bg: "bg-rose-50", border: "hover:border-rose-500/50" },
    amber: { text: "text-amber-600", bg: "bg-amber-50", border: "hover:border-amber-500/50" },
    emerald: { text: "text-emerald-600", bg: "bg-emerald-50", border: "hover:border-emerald-500/50" },
  };

  const theme = themes[color] || themes.indigo;

  return (
    <div className={`
      card-modern relative overflow-hidden p-7 group transition-all duration-300 cursor-default
      border-2 border-transparent hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60
      ${theme.border}
    `}>
      {/* Background Decorative Element */}
      <div className={`absolute -right-6 -top-6 w-20 h-20 rounded-full ${theme.bg} opacity-40 group-hover:scale-150 transition-transform duration-700`} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-1.5 h-1.5 rounded-full ${theme.text.replace('text', 'bg')}`} />
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
            {title}
          </p>
        </div>
        
        <div className="flex items-baseline gap-3">
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
            {value}
          </h3>
          <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${theme.text} ${theme.bg}`}>
            {trend}
          </span>
        </div>
      </div>
      
      {/* Animated Bottom Line (Only if showLine is true) */}
      {showLine && (
        <div className={`absolute bottom-0 left-0 h-[4px] w-0 group-hover:w-full transition-all duration-500 ${theme.text.replace('text', 'bg')}`} />
      )}
    </div>
  );
}