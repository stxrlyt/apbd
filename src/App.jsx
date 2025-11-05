import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";

// SINGLE-FILE demo React app (Tailwind CSS)
// Exports default App component. Uses local state to simulate backend.
// Pages: Dashboard, CreateDraft, Approval (single-level), Revisions, Reports

// ---------- Mock utilities ----------
const uid = () => Math.random().toString(36).slice(2, 9);
const now = () => new Date().toISOString();

// ---------- Sample data ----------
const initialDrafts = [
  {
    id: "d1",
    title: "Pembangunan Jalan Desa 2026",
    createdBy: "Kaur Keuangan",
    createdAt: "2025-10-01T09:00:00Z",
    status: "Draft",
    versions: [
      {
        vid: "v1",
        summary: "Initial draft",
        createdAt: "2025-10-01T09:00:00Z",
        createdBy: "Kaur Keuangan",
        items: [
          { code: "5001", name: "Material: Batu & Pasir", qty: 100, unit: "m3", unitPrice: 50000 },
          { code: "5002", name: "Upah Tenaga Kerja", qty: 200, unit: "hari", unitPrice: 150000 }
        ]
      }
    ]
  }
];

// ---------- Layout components ----------
function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-7xl mx-auto p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">APBD Draft Management (Village)</h1>
        </header>
        <aside className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
            <Link to="/" className="px-3 py-1 rounded hover:bg-slate-100">Dashboard</Link>
            <Link to="/create" className="px-3 py-1 rounded hover:bg-slate-100">Create Draft</Link>
            <Link to="/approval" className="px-3 py-1 rounded hover:bg-slate-100">Approval</Link>
            <Link to="/revisions" className="px-3 py-1 rounded hover:bg-slate-100">Revisions</Link>
            <Link to="/reports" className="px-3 py-1 rounded hover:bg-slate-100">Reports</Link>
          </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

// ---------- Pages ----------

function Dashboard({ drafts }) {
  const totalDrafts = drafts.length;
  const pending = drafts.filter(d => d.status === "Pending").length;
  const approved = drafts.filter(d => d.status === "Approved").length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
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
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-slate-50 p-4 rounded border">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

// Create Draft Page
function CreateDraft({ onCreate }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const [itemDraft, setItemDraft] = useState({ code: "", name: "", qty: 0, unit: "", unitPrice: 0 });

  function addItem() {
    if (!itemDraft.name) return;
    setItems(prev => [...prev, { ...itemDraft }]);
    setItemDraft({ code: "", name: "", qty: 0, unit: "", unitPrice: 0 });
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  function submit() {
    const newDraft = {
      id: uid(),
      title: title || "Untitled Draft",
      createdBy: "User Lokal",
      createdAt: now(),
      status: "Draft",
      versions: [
        {
          vid: uid(),
          summary: "Initial",
          createdAt: now(),
          createdBy: "User Lokal",
          items
        }
      ]
    };
    onCreate(newDraft);
    navigate("/");
  }

  const total = items.reduce((s, it) => s + (Number(it.qty) * Number(it.unitPrice)), 0);

  return (
    <div className="bg-white p-6 rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Create APBD Draft</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border rounded p-2" placeholder="Judul Rencana..." />
        </div>

        <div className="border p-3 rounded">
          <h3 className="font-medium">Add Budget Item</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input placeholder="Kode" value={itemDraft.code} onChange={e => setItemDraft(s => ({ ...s, code: e.target.value }))} className="p-2 border rounded" />
            <input placeholder="Nama item" value={itemDraft.name} onChange={e => setItemDraft(s => ({ ...s, name: e.target.value }))} className="p-2 border rounded" />
            <input placeholder="Qty" type="number" value={itemDraft.qty} onChange={e => setItemDraft(s => ({ ...s, qty: e.target.value }))} className="p-2 border rounded" />
            <input placeholder="Satuan" value={itemDraft.unit} onChange={e => setItemDraft(s => ({ ...s, unit: e.target.value }))} className="p-2 border rounded" />
            <input placeholder="Harga Satuan" type="number" value={itemDraft.unitPrice} onChange={e => setItemDraft(s => ({ ...s, unitPrice: e.target.value }))} className="p-2 border rounded col-span-2" />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={addItem} className="px-3 py-1 bg-green-600 text-white rounded">Add Item</button>
          </div>

          <div className="mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600">
                  <th>Kode</th>
                  <th>Nama</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} className="border-t">
                    <td>{it.code}</td>
                    <td>{it.name}</td>
                    <td>{it.qty}</td>
                    <td>{it.unit}</td>
                    <td>{Number(it.unitPrice).toLocaleString()}</td>
                    <td>{(Number(it.qty) * Number(it.unitPrice)).toLocaleString()}</td>
                    <td><button onClick={() => removeItem(idx)} className="text-sm text-red-600">Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-right font-semibold">Total: Rp {total.toLocaleString()}</div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={submit} className="px-4 py-2 bg-indigo-600 text-white rounded">Save Draft</button>
        </div>
      </div>
    </div>
  );
}

// Approval Page (single-level approval)
function Approval({ drafts, onApprove, onRequestChanges }) {
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

// Revisions Page
function Revisions({ drafts, onAddVersion }) {
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
                <VersionAdder draft={d} onAddVersion={onAddVersion} />
              </div>
            </div>

            <VersionList versions={d.versions} />
          </div>
        ))}
      </div>
    </div>
  );
}

function VersionList({ versions }) {
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

function VersionAdder({ draft, onAddVersion }) {
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

// Reports Page
function Reports({ drafts }) {
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

// Draft Detail Page (view, compare versions)
function DraftDetail({ drafts, onAddVersion }) {
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

// ---------- Root App ----------
export default function App() {
  const [drafts, setDrafts] = useState(initialDrafts);

  function handleCreate(newDraft) {
    setDrafts(prev => [newDraft, ...prev]);
  }

  function handleApprove(id) {
    setDrafts(prev => prev.map(d => d.id === id ? ({ ...d, status: "Approved", approvedAt: now() }) : d));
  }

  function handleRequestChanges(id) {
    setDrafts(prev => prev.map(d => d.id === id ? ({ ...d, status: "Needs Changes" }) : d));
  }

  function handleAddVersion(draftId, version) {
    setDrafts(prev => prev.map(d => d.id === draftId ? ({ ...d, versions: [...d.versions, version] }) : d));
  }

  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard drafts={drafts} />} />
          <Route path="/create" element={<CreateDraft onCreate={handleCreate} />} />
          <Route path="/approval" element={<Approval drafts={drafts} onApprove={handleApprove} onRequestChanges={handleRequestChanges} />} />
          <Route path="/revisions" element={<Revisions drafts={drafts} onAddVersion={handleAddVersion} />} />
          <Route path="/reports" element={<Reports drafts={drafts} />} />
          <Route path="/draft/:id" element={<DraftDetail drafts={drafts} onAddVersion={handleAddVersion} />} />
        </Routes>
      </AppShell>
    </Router>
  );
}
