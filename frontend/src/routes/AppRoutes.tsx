import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import Dashboard from "../features/candidates/Dashboard";
import LoginPage from "../features/auth/LoginPage";
import CandidateDetail from "../features/candidates/CandidateDetail";
import AnalyticsPage from "../features/analytics/AnalyticsPage";
import PublicCandidateForm from "../features/candidates/PublicCandidateForm";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
        <Routes>

          {/* 🌐 PUBLIC ROUTES */}
          <Route path="/" element={<Navigate to="/apply" />} />
          <Route path="/apply" element={<PublicCandidateForm />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 🔒 PRIVATE ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/candidates/:id"
            element={
              <ProtectedRoute>
                <CandidateDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>
    </BrowserRouter>
  );
}