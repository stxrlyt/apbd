import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDrafts } from "../contexts/DraftsContext";

// Approval Page (single-level approval)
function Approval() {
  const { drafts, approveDraft, requestChanges } = useDrafts();
  const pending = drafts.filter(d => d.status === "Draft" || d.status === "Pending");

  return (
    <div className="bg-white p-6 rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Approval - Single Level</h2>
      {pending.length === 0 ? (
        <div className="text-slate-500">No drafts pending approval.</div>
      ) : (
        <div className="space-y-3">
          {pending.map(d => (
            <div key={d.id} className="p-3 border rounded flex items-start justify-between">
              <div>
                <div className="font-semibold">{d.title}</div>
                <div className="text-sm text-slate-500">Created by {d.createdBy} • {new Date(d.createdAt).toLocaleDateString()}</div>
                <div className="mt-2 text-sm">
                  Latest version: {d.versions[d.versions.length - 1].summary} • {new Date(d.versions[d.versions.length - 1].createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onApprove(d.id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                <button onClick={() => onRequestChanges(d.id)} className="px-3 py-1 border rounded">Request Changes</button>
                <Link to={`/draft/${d.id}`} className="px-3 py-1 border rounded">Open</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Approval