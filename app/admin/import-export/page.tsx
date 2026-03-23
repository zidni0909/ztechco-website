"use client";

import { useState } from "react";

export default function ImportExportPage() {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/import-export", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setSuccess("Data imported successfully");
    } catch (err: any) {
      setError(err.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/import-export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "exported-data.json";
      a.click();
      window.URL.revokeObjectURL(url);
      setSuccess("Data exported successfully");
    } catch (err: any) {
      setError(err.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Import / Export Data</h1>
      <div className="mb-6">
        <label className="block mb-2 font-medium">Import Data (JSON)</label>
        <input type="file" accept="application/json" onChange={handleImport} disabled={importing} />
        {importing && <div className="mt-2 text-blue-600">Importing...</div>}
      </div>
      <div className="mb-6">
        <button className="btn-primary" onClick={handleExport} disabled={exporting}>
          Export Data
        </button>
        {exporting && <div className="mt-2 text-blue-600">Exporting...</div>}
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">{success}</div>}
    </div>
  );
}
