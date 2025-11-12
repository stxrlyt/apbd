import React, { useState } from "react";
import { uid, now } from "../utils/helpers"; // Import helpers

// Notice the props are exactly what the Revisions page passed to it
export default function VersionAdder({ draft, onAddVersion }) {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState("");

  function addVersion() {
    const latest = draft.versions[draft.versions.length - 1];
    const newV = {
      vid: uid(),
      summary: summary || "Perubahan",
      createdAt: now(),
      createdBy: "User Lokal",
      // shallow copy of items (in real app user edits them)
      items: latest.items.map(it => ({ ...it }))
    };
    onAddVersion(draft.id, newV);
    setSummary("");
    setOpen(false);
  }

  return (
    <div>
      <button onClick={() => setOpen(o => !o)} className="px-3 py-1 bg-slate-100 rounded">New Version</button>
      {open && (
        <div className="mt-2 p-3 border rounded bg-slate-50">
          <input value={summary} onChange={e => setSummary(e.target.value)} placeholder="Ringkasan perubahan" className="w-full p-2 border rounded" />
          <div className="mt-2 flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="px-3 py-1 border rounded">Cancel</button>
            <button onClick={addVersion} className="px-3 py-1 bg-indigo-600 text-white rounded">Add</button>
          </div>
        </div>
      )}
    </div>
  );
}