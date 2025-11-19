import React from "react";
import { Link } from "react-router-dom";
import { useDrafts } from "../contexts/DraftsContext";
import { useAuth } from "../contexts/AuthContext";
import { canEditDraft } from "../utils/permissions";
import VersionList from "../components/VersionList";
import VersionAdder from "../components/VersionAdder";

// Revisions Page
export default function Revisions() {
  const { drafts, addVersion, loading } = useDrafts();
  const { role } = useAuth();
  
  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Revisions & Version Control</h2>
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }
  
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
                {canEditDraft(role) && (
                  <VersionAdder draft={d} onAddVersion={addVersion} />
                )}
              </div>
            </div>

            <VersionList versions={d.versions} />
          </div>
        ))}
      </div>
    </div>
  );
}