import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDrafts } from "../contexts/DraftsContext";

// Reports Page
export default function Reports() {
  const {drafts} = useDrafts();
  // Simple report: show approved drafts and export placeholder
  const approved = drafts.filter(d => d.status === "Approved");

  function exportExcel() {
    alert("Simulated export: Generating Excel (placeholder)");
  }

  function exportPDF() {
    alert("Simulated export: Generating PDF (placeholder)");
  }

  return (
    <div className="bg-white p-6 rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Reports & Documentation</h2>
      <div className="mb-4 text-slate-600">Generate standardized APBD documents for submission or archiving.</div>

      <div className="space-y-4">
        <div>
          <div className="font-medium">Approved Drafts</div>
          <ul className="mt-2 space-y-2">
            {approved.length === 0 && <li className="text-slate-500">No approved drafts yet.</li>}
            {approved.map(d => (
              <li key={d.id} className="p-2 border rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{d.title}</div>
                  <div className="text-xs text-slate-500">Approved: {new Date(d.approvedAt).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={exportPDF} className="px-3 py-1 border rounded">PDF</button>
                  <button onClick={exportExcel} className="px-3 py-1 border rounded">Excel</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="border rounded p-3">
          <div className="font-medium">Report Templates</div>
          <div className="mt-2 text-sm text-slate-600">Pre-built templates for APBD drafts, meeting minutes, and approval letters. (Configurable)</div>
        </div>
      </div>
    </div>
  );
}
