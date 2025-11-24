import React, { useState } from "react";

 const incomeSources = [
  { id: 1, name: "Gaji Bulanan" },
  { id: 2, name: "Freelance" },
  { id: 3, name: "Investasi" },
  { id: 4, name: "Lain-lain" },
];

export default function Income() {
  const [selectedSource, setSelectedSource] = useState("");
  const [amount, setAmount] = useState("");
  const [records, setRecords] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSource || !amount) {
      alert("Pilih sumber income dan masukkan jumlah!");
      return;
    }

    const newRecord = {
      id: records.length + 1,
      source: incomeSources.find((s) => s.id === parseInt(selectedSource))?.name,
      amount: parseFloat(amount),
      date: new Date().toLocaleDateString(),
    };

    setRecords([...records, newRecord]);
    setSelectedSource("");
    setAmount("");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Input Pemasukan</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Sumber Income</label>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Pilih Sumber --</option>
            {incomeSources.map((src) => (
              <option key={src.id} value={src.id}>
                {src.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Jumlah (Rp)</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Masukkan jumlah"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Tambah Pemasukan
        </button>
      </form>

      {records.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Riwayat Pemasukan</h2>
          <ul className="space-y-2">
            {records.map((r) => (
              <li
                key={r.id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{r.source}</p>
                  <p className="text-sm text-gray-600">{r.date}</p>
                </div>
                <p className="font-semibold">Rp {r.amount.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
