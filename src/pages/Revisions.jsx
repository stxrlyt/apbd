import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDrafts } from "../contexts/DraftsContext";
import VersionList from "../components/VersionList";
import VersionAdder from "../components/VersionAdder";

// Revisions Page
export default function Revisions() {
  const { drafts, addVersion } = useDrafts();
  return (
    <div className="bg-white p-6 rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Revisions & Version Control</h2>
      <div className="space-y-4">
        {drafts.map(d => (
          <div key={d.id} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{d.title}</div>
                <div className="text-sm text-slate-500">{d.versions.length} version(s) • Last: {new Date(d.versions[d.versions.length - 1].createdAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <Link to={`/draft/${d.id}`} className="px-3 py-1 border rounded">Open</Link>
                <VersionAdder draft={d} onAddVersion={addVersion} />
              </div>
            </div>

            <VersionList versions={d.versions} />
          </div>
        ))}
      </div>
    </div>
  );
}