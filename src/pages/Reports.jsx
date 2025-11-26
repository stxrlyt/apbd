import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import {doc, documentId, getDoc} from "firebase/firestore";
import {db} from "../firebase/config";
import * as XLSX from "xlsx";

import { useDrafts } from "../contexts/DraftsContext";

// Reports Page
export default function Reports() {
  const {drafts} = useDrafts();
  // Simple report: show approved drafts and export placeholder
  const approved = drafts.filter(d => d.status === "Approved");

  const flatten = (dataArray)=>{
    let result = [];

    dataArray.forEach(mainRecord => {
      const { id, title, createdAt, createdBy, status, updatedAt, versions} = mainRecord;

      versions.forEach(version => {
        const { createdAt: versionCreatedAt, createdBy: versionCreatedBy, vid: versionId, summary: versionSummary, items = [], revenues = [] } = version;

        items.forEach(item => {
          const flatRow = {
            'Entry Type': 'Budget',
            'Title': title,
            'Created At (Main)': createdAt,
            'Created By (Main)': createdBy,
            'Status': status,
            'Updated At': updatedAt,
            'Version Created At': versionCreatedAt,
            'Version Created By': versionCreatedBy,
            'Version ID': versionId,
            'Version Summary': versionSummary,

            'Item Code': item.code,
            'Item Name': item.name,
            'Quantity': item.qty,
            'Unit': item.unit,
            'Unit Price': item.unitPrice,
            'Amount': Number(item.qty) * Number(item.unitPrice || 0)
          };
          result.push(flatRow);
        });

        revenues.forEach(revenue => {
          const revenueRow = {
            'Entry Type': 'Revenue',
            'Title': title,
            'Created At (Main)': createdAt,
            'Created By (Main)': createdBy,
            'Status': status,
            'Updated At': updatedAt,
            'Version Created At': versionCreatedAt,
            'Version Created By': versionCreatedBy,
            'Version ID': versionId,
            'Version Summary': versionSummary,

            'Item Code': revenue.code,
            'Item Name': revenue.name,
            'Quantity': null,
            'Unit': null,
            'Unit Price': null,
            'Amount': Number(revenue.revenueAmount || 0)
          };
          result.push(revenueRow);
        });
      });
    });
    return result;
  }

  const exportExcel = async (documentId) => {
    try {
      const snap = await getDoc(doc(db, "drafts", documentId));

      if (!snap.exists()){
        alert("Document not found");
        return;
      }

      const data = snap.data();

      const flattened = flatten([data]);

      const worksheet = XLSX.utils.json_to_sheet(flattened);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Draft");

      XLSX.writeFile(workbook, `Report_${documentId}.xlsx`);
    }
    catch (error){
      console.error("Export error: ", error);
      alert("Failed to export: " + error.message);
    }
  };

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
                  <button onClick={() => exportExcel(d.id)} className="px-3 py-1 border rounded">Excel</button>
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
