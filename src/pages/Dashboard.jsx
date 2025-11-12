import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDrafts } from "../contexts/DraftsContext";
import StatCard from "../components/StatCard";

function Dashboard() {
  const { drafts } = useDrafts();

  const totalDrafts = drafts.length;
  const pending = drafts.filter(d => d.status === "Pending").length;
  const approved = drafts.filter(d => d.status === "Approved").length;

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
            {drafts.map(d => (
              <div key={d.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-semibold">{d.title}</div>
                  <div className="text-sm text-slate-500">{d.createdBy} • {new Date(d.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="text-sm text-slate-600">{d.status}</div>
              </div>
            ))}
          </div>
        </section>

        <aside className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/create" className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded">Create New Draft</Link>
            <Link to="/approval" className="block w-full text-center px-4 py-2 border rounded">Review Pending</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;