import React from "react";

export default function VersionList({ versions }) {
  return (
    <div className="mt-3">
      <div className="text-sm text-slate-600">Versions</div>
      <ul className="mt-2 space-y-2">
        {versions.map(v => (
          <li key={v.vid} className="p-2 border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{v.summary}</div>
              <div className="text-xs text-slate-500">by {v.createdBy} • {new Date(v.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-sm">Items: {v.items.length}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}