import React from "react";
import { Link } from "react-router-dom";
import { useDrafts } from "../contexts/DraftsContext";
import { useAuth } from "../contexts/AuthContext";
import { canCreateDraft, canApproveDraft } from "../utils/permissions";
import StatCard from "../components/StatCard";

function Dashboard() {
  const { drafts, loading } = useDrafts();
  const { role } = useAuth();

  const totalDrafts = drafts.length;
  const pending = drafts.filter(d => d.status === "Pending").length;
  const approved = drafts.filter(d => d.status === "Approved").length;

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-slate-500">Loading drafts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold mb-4">Overview</h2>
            <p>Period: 2026</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Total Drafts" value={totalDrafts} />
            <StatCard label="Pending Approval" value={pending} />
            <StatCard label="Approved" value={approved} />
          </div>

          <h3 className="mt-6 font-medium">Recent Drafts</h3>
          <div className="mt-3 space-y-3">
            {drafts.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No drafts yet.</div>
            ) : (
              drafts.map(d => (
                <Link
                  key={d.id}
                  to={`/draft/${d.id}`}
                  className="flex items-center justify-between p-3 border rounded hover:bg-slate-50 hover:border-indigo-300 transition-colors"
                >
                  <div>
                    <div className="font-semibold">{d.title}</div>
                    <div className="text-sm text-slate-500">{d.createdBy} • {new Date(d.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-sm text-slate-600">{d.status}</div>
                </Link>
              ))
            )}
          </div>
        </section>

        <aside className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {canCreateDraft(role) && (
              <Link to="/create" className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded">Create New Draft</Link>
            )}
            {canApproveDraft(role) && (
              <Link to="/approval" className="block w-full text-center px-4 py-2 border rounded">Review Pending</Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;