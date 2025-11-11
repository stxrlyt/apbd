import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDrafts } from "../contexts/DraftsContext";

// Draft Detail Page (view, compare versions)
export default function DraftDetail() {
  const { drafts, onAddVersion } = useDrafts();
  const { id } = useParams();
  const draft = drafts.find(d => d.id === id);
  const [leftV, setLeftV] = useState(null);
  const [rightV, setRightV] = useState(null);

  if (!draft) return <div className="bg-white p-6 rounded">Draft not found.</div>;

  function compare() {
    if (!leftV || !rightV) return null;
    // naive compare: list items differences by name and subtotal
    const mapLeft = new Map(leftV.items.map(it => [it.code || it.name, it]));
    const mapRight = new Map(rightV.items.map(it => [it.code || it.name, it]));
    const keys = new Set([...mapLeft.keys(), ...mapRight.keys()]);
    const rows = [];
    keys.forEach(k => {
      const a = mapLeft.get(k);
      const b = mapRight.get(k);
      rows.push({ key: k, left: a || null, right: b || null });
    });
    return rows;
  }

  const rows = useMemo(compare, [leftV, rightV]);

  return (
    <div className="bg-white p-6 rounded shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{draft.title}</h2>
          <div className="text-sm text-slate-500">Created by {draft.createdBy} • {new Date(draft.createdAt).toLocaleDateString()}</div>
        </div>
        <div className="text-sm">Status: <span className="font-medium">{draft.status}</span></div>
      </div>

      <div className="border p-3 rounded">
        <h3 className="font-medium">Versions</h3>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs">Left</label>
            <select className="w-full p-2 border rounded" onChange={e => setLeftV(draft.versions.find(v => v.vid === e.target.value))}>
              <option value="">-- Select version --</option>
              {draft.versions.map(v => <option key={v.vid} value={v.vid}>{v.summary} • {new Date(v.createdAt).toLocaleString()}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs">Right</label>
            <select className="w-full p-2 border rounded" onChange={e => setRightV(draft.versions.find(v => v.vid === e.target.value))}>
              <option value="">-- Select version --</option>
              {draft.versions.map(v => <option key={v.vid} value={v.vid}>{v.summary} • {new Date(v.createdAt).toLocaleString()}</option>)}
            </select>
          </div>
        </div>

        {leftV && rightV && (
          <div className="mt-4">
            <h4 className="font-medium">Comparison</h4>
            <table className="w-full text-sm mt-2">
              <thead>
                <tr className="text-left text-slate-600">
                  <th>Item</th>
                  <th>Left Subtotal</th>
                  <th>Right Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.key} className="border-t">
                    <td>{r.key}</td>
                    <td>{r.left ? (Number(r.left.qty) * Number(r.left.unitPrice)).toLocaleString() : "-"}</td>
                    <td>{r.right ? (Number(r.right.qty) * Number(r.right.unitPrice)).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}