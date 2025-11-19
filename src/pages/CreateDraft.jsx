import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDrafts } from "../contexts/DraftsContext";
import { useAuth } from "../contexts/AuthContext";
import { canCreateDraft } from "../utils/permissions";
import { uid, now } from "../utils/helpers";

// Create Draft Page
export default function CreateDraft() {
  const { createDraft } = useDrafts();
  const { userData, role } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const [itemDraft, setItemDraft] = useState({ code: "", name: "", qty: 0, unit: "", unitPrice: 0 });

  // Check permissions
  if (!canCreateDraft(role)) {
    return (
      <div className="bg-white p-6 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
        <p className="text-slate-600">You don't have permission to create drafts. Only admins and secretaries can create drafts.</p>
      </div>
    );
  }

  function addItem() {
    if (!itemDraft.name) return;
    setItems(prev => [...prev, { ...itemDraft }]);
    setItemDraft({ code: "", name: "", qty: 0, unit: "", unitPrice: 0 });
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  async function submit() {
    try {
      const newDraft = {
        title: title || "Untitled Draft",
        createdBy: userData?.displayName || userData?.email || "Unknown User",
        createdAt: now(),
        status: "Draft",
        versions: [
          {
            vid: uid(),
            summary: "Initial",
            createdAt: now(),
            createdBy: userData?.displayName || userData?.email || "Unknown User",
            items
          }
        ]
      };
      await createDraft(newDraft);
      navigate("/");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
    }
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