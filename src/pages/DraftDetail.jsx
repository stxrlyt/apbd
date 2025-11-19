import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDrafts } from "../contexts/DraftsContext";
import { useAuth } from "../contexts/AuthContext";
import { canEditDraft, canApproveDraft } from "../utils/permissions";
import VersionAdder from "../components/VersionAdder";

// Draft Detail Page (view, compare versions)
export default function DraftDetail() {
  const { drafts, addVersion, approveDraft, requestChanges, loading } = useDrafts();
  const { id } = useParams();
  const { role } = useAuth();
  const navigate = useNavigate();
  const draft = drafts.find(d => d.id === id);
  const [leftV, setLeftV] = useState(null);
  const [rightV, setRightV] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow-sm">
        <p className="text-slate-500">Loading draft details...</p>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="bg-white p-6 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Draft Not Found</h2>
        <p className="text-slate-600 mb-4">The draft you're looking for doesn't exist or has been deleted.</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Get the latest version or selected version
  const currentVersion = selectedVersion || draft.versions[draft.versions.length - 1];
  const currentItems = currentVersion?.items || [];
  const currentTotal = currentItems.reduce((sum, item) => sum + (Number(item.qty) * Number(item.unitPrice)), 0);

  // Status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      "Draft": "bg-yellow-100 text-yellow-800",
      "Pending": "bg-blue-100 text-blue-800",
      "Approved": "bg-green-100 text-green-800",
      "Needs Changes": "bg-red-100 text-red-800"
    };
    return styles[status] || "bg-slate-100 text-slate-800";
  };

  function compare() {
    if (!leftV || !rightV || !leftV.items || !rightV.items) return null;
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

  const rows = useMemo(() => compare(), [leftV, rightV]);

  async function handleApprove() {
    if (window.confirm("Are you sure you want to approve this draft?")) {
      try {
        await approveDraft(draft.id);
        alert("Draft approved successfully!");
      } catch (error) {
        alert("Failed to approve draft. Please try again.");
      }
    }
  }

  async function handleRequestChanges() {
    if (window.confirm("Request changes for this draft?")) {
      try {
        await requestChanges(draft.id);
        alert("Changes requested successfully!");
      } catch (error) {
        alert("Failed to request changes. Please try again.");
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white p-6 rounded shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{draft.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div>
                <span className="font-medium">Created by:</span> {draft.createdBy}
              </div>
              <div>
                <span className="font-medium">Created:</span> {new Date(draft.createdAt).toLocaleString()}
              </div>
              {draft.approvedAt && (
                <div>
                  <span className="font-medium">Approved:</span> {new Date(draft.approvedAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(draft.status)}`}>
              {draft.status}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {(canApproveDraft(role) && (draft.status === "Draft" || draft.status === "Pending")) && (
          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Approve Draft
            </button>
            <button
              onClick={handleRequestChanges}
              className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-50"
            >
              Request Changes
            </button>
          </div>
        )}
      </div>

      {/* Current Version Details */}
      <div className="bg-white p-6 rounded shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Current Version</h2>
          {draft.versions.length > 1 && (
            <select
              value={selectedVersion?.vid || currentVersion?.vid || ""}
              onChange={(e) => {
                const version = draft.versions.find(v => v.vid === e.target.value);
                setSelectedVersion(version);
              }}
              className="px-3 py-2 border rounded text-sm"
            >
              {draft.versions.map(v => (
                <option key={v.vid} value={v.vid}>
                  {v.summary} • {new Date(v.createdAt).toLocaleString()}
                </option>
              ))}
            </select>
          )}
        </div>

        {currentVersion && (
          <div>
            <div className="mb-4 text-sm text-slate-600">
              <span className="font-medium">Version:</span> {currentVersion.summary} • 
              <span className="font-medium"> Created by:</span> {currentVersion.createdBy} • 
              <span className="font-medium"> Date:</span> {new Date(currentVersion.createdAt).toLocaleString()}
            </div>

            {currentItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b bg-slate-50">
                      <th className="p-3 font-medium">Kode</th>
                      <th className="p-3 font-medium">Nama Item</th>
                      <th className="p-3 font-medium text-right">Qty</th>
                      <th className="p-3 font-medium">Unit</th>
                      <th className="p-3 font-medium text-right">Unit Price</th>
                      <th className="p-3 font-medium text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-slate-50">
                        <td className="p-3">{item.code || "-"}</td>
                        <td className="p-3">{item.name}</td>
                        <td className="p-3 text-right">{Number(item.qty).toLocaleString()}</td>
                        <td className="p-3">{item.unit || "-"}</td>
                        <td className="p-3 text-right">Rp {Number(item.unitPrice).toLocaleString()}</td>
                        <td className="p-3 text-right font-medium">
                          Rp {(Number(item.qty) * Number(item.unitPrice)).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 font-semibold">
                      <td colSpan="5" className="p-3 text-right">Total:</td>
                      <td className="p-3 text-right">Rp {currentTotal.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No items in this version.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Version History */}
      <div className="bg-white p-6 rounded shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Version History</h2>
          {canEditDraft(role) && (
            <VersionAdder draft={draft} onAddVersion={addVersion} />
          )}
        </div>
        <div className="space-y-2">
          {draft.versions.map((version, idx) => (
            <div
              key={version.vid}
              className={`p-3 border rounded ${version.vid === currentVersion?.vid ? 'bg-indigo-50 border-indigo-200' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    Version {idx + 1}: {version.summary}
                    {version.vid === currentVersion?.vid && (
                      <span className="ml-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded">Current</span>
                    )}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Created by {version.createdBy} • {new Date(version.createdAt).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {version.items?.length || 0} items • Total: Rp {version.items?.reduce((sum, item) => sum + (Number(item.qty) * Number(item.unitPrice)), 0).toLocaleString() || 0}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVersion(version)}
                  className="px-3 py-1 text-sm border rounded hover:bg-slate-50"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Version Comparison */}
      <div className="bg-white p-6 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Compare Versions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Left Version</label>
            <select
              className="w-full p-2 border rounded"
              value={leftV?.vid || ""}
              onChange={(e) => setLeftV(draft.versions.find(v => v.vid === e.target.value) || null)}
            >
              <option value="">-- Select version --</option>
              {draft.versions.map(v => (
                <option key={v.vid} value={v.vid}>
                  {v.summary} • {new Date(v.createdAt).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Right Version</label>
            <select
              className="w-full p-2 border rounded"
              value={rightV?.vid || ""}
              onChange={(e) => setRightV(draft.versions.find(v => v.vid === e.target.value) || null)}
            >
              <option value="">-- Select version --</option>
              {draft.versions.map(v => (
                <option key={v.vid} value={v.vid}>
                  {v.summary} • {new Date(v.createdAt).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {leftV && rightV && rows && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Comparison Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="p-2 border">Item</th>
                    <th className="p-2 border text-right">Left Subtotal</th>
                    <th className="p-2 border text-right">Right Subtotal</th>
                    <th className="p-2 border text-right">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => {
                    const leftTotal = r.left ? (Number(r.left.qty) * Number(r.left.unitPrice)) : 0;
                    const rightTotal = r.right ? (Number(r.right.qty) * Number(r.right.unitPrice)) : 0;
                    const diff = rightTotal - leftTotal;
                    return (
                      <tr key={idx} className="border-b">
                        <td className="p-2 border">{r.key}</td>
                        <td className="p-2 border text-right">
                          {r.left ? `Rp ${leftTotal.toLocaleString()}` : "-"}
                        </td>
                        <td className="p-2 border text-right">
                          {r.right ? `Rp ${rightTotal.toLocaleString()}` : "-"}
                        </td>
                        <td className={`p-2 border text-right font-medium ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : ''}`}>
                          {r.left && r.right ? `Rp ${diff.toLocaleString()}` : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}