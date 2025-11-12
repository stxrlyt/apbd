import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";

// ---------- Layout components ----------
export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex">
        <aside className="w-64 bg-white p-6 shadow-xl sticky top-0 h-screen">
          <h1 className="text-xl font-bold mb-6">APBDes</h1>
          <nav className="flex flex-col gap-1 font-sans text-base font-normal text-blue-gray-700">
            <Link to="/" className="px-3 py-2 rounded hover:bg-slate-100">Dashboard</Link>
            <Link to="/create" className="px-3 py-2 rounded hover:bg-slate-100">Create Draft</Link>
            <Link to="/income" className="px-3 py-2 rounded hover:bg-slate-100">Incomes</Link>
            <Link to="/approval" className="px-3 py-2 rounded hover:bg-slate-100">Approval</Link>
            <Link to="/revisions" className="px-3 py-2 rounded hover:bg-slate-100">Revisions</Link>
            <Link to="/reports" className="px-3 py-2 rounded hover:bg-slate-100">Reports</Link>
          </nav>
        </aside>
        <main className="flex-grow p-6">{children}</main>
      </div>
    </div>
  );
}
