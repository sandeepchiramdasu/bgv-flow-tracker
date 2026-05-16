import Navbar from "../components/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* 🌌 AMBIENT BACKGROUND */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-200/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-[10%] w-[40%] h-[40%] bg-blue-100/30 blur-[100px] rounded-full" />
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow max-w-[1440px] w-full mx-auto px-6 lg:px-10 py-8 animate-fade-in-up">
          {children}
        </main>

        <footer className="py-10 text-center">
          <div className="h-[1px] w-1/4 mx-auto bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            BGV Flow <span className="mx-2">•</span> Precision Verification Engine
          </p>
        </footer>
      </div>
    </div>
  );
}