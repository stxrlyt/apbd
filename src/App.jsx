import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DraftsProvider } from "./contexts/DraftsContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Layout
import AppShell from "./components/AppShell";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateDraft from "./pages/CreateDraft";
import Approval from "./pages/Approval";
import Revisions from "./pages/Revisions";
import Reports from "./pages/Reports";
import DraftDetail from "./pages/DraftDetail";

// ---------- Root App ----------
export default function App() {
  return (
    <AuthProvider>
      <DraftsProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/create" element={<CreateDraft />} />
                      <Route path="/approval" element={<Approval />} />
                      <Route path="/revisions" element={<Revisions />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/draft/:id" element={<DraftDetail />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </AppShell>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </DraftsProvider>
    </AuthProvider>
  );
}
