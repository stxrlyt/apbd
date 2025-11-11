// ---------- Sample data ----------
export const initialDrafts = [
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