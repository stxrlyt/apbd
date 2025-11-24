import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { canCreateDraft, canApproveDraft } from "../utils/permissions";

// ---------- Layout components ----------
export default function AppShell({ children }) {
  const { userData, signOut, role } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    const result = await signOut();
    if (result.success) {
      navigate("/login");
    }
  }

  const roleDisplay = role ? role.charAt(0).toUpperCase() + role.slice(1) : "User";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex">
        <aside className="w-64 bg-white p-6 shadow-xl sticky top-0 h-screen flex flex-col">
          <h1 className="text-xl font-bold mb-6">APBDes</h1>
          
          {/* User Info */}
          <div className="mb-6 p-3 bg-slate-50 rounded">
            <div className="text-sm font-medium">{userData?.displayName || "User"}</div>
            <div className="text-xs text-slate-500">{userData?.email}</div>
            <div className="text-xs text-indigo-600 mt-1 font-medium">{roleDisplay}</div>
          </div>

          <nav className="flex flex-col gap-1 font-sans text-base font-normal text-blue-gray-700 flex-grow">
            <Link to="/" className="px-3 py-2 rounded hover:bg-slate-100">Dashboard</Link>
            {canCreateDraft(role) && (
              <Link to="/create" className="px-3 py-2 rounded hover:bg-slate-100">Create Draft</Link>
            )}
            {canApproveDraft(role) && (
              <Link to="/approval" className="px-3 py-2 rounded hover:bg-slate-100">Approval</Link>
            )}
            <Link to="/revisions" className="px-3 py-2 rounded hover:bg-slate-100">Revisions</Link>
            <Link to="/reports" className="px-3 py-2 rounded hover:bg-slate-100">Reports</Link>
          </nav>

          <button
            onClick={handleSignOut}
            className="mt-auto px-3 py-2 text-sm text-red-600 rounded hover:bg-red-50"
          >
            Sign Out
          </button>
        </aside>
        <main className="flex-grow p-6">{children}</main>
      </div>
    </div>
  );
}
