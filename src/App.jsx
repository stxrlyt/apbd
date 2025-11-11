import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { DraftsProvider } from "./contexts/DraftsContext";

// Layout
import AppShell from "./components/AppShell";

// Pages
import Dashboard from "./pages/Dashboard";
import CreateDraft from "./pages/CreateDraft";
import Approval from "./pages/Approval";
import Revisions from "./pages/Revisions";
import Reports from "./pages/Reports";
import DraftDetail from "./pages/DraftDetail";

// ---------- Root App ----------
export default function App() {
  return (
    // Provide the drafts state to the whole app
    <DraftsProvider>
      <Router>
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateDraft />} />
            <Route path="/approval" element={<Approval />} />
            <Route path="/revisions" element={<Revisions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/draft/:id" element={<DraftDetail />} />
          </Routes>
        </AppShell>
      </Router>
    </DraftsProvider>
  );
}
