import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

export default function MyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  const fetchMyInvoices = async () => {
    const token = localStorage.getItem("auth_token");
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/invoices/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setInvoices(data);
    } else {
      alert("Failed to load your invoices.");
    }
  };

  useEffect(() => {
    fetchMyInvoices();
  }, []);

  const downloadInvoice = (invoice) => {
    const rows = invoice.data
      .filter(row => row.units > 0)  // Optional: only include rows with work done
      .map((row) => [
        row.client_name,
        row.service,
        row.service_code,
        row.case_number,
        row.client_number,
        row.units,
        row.rate,
        row.total,
      ]);

    const sheet = XLSX.utils.aoa_to_sheet([
      [`Provider: You`],
      [`Invoice Period: ${invoice.start_date} to ${invoice.end_date}`],
      [],
      ["Client", "Service", "Code", "Case #", "Client #", "Units", "Rate", "Total"],
      ...rows,
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Invoice");
    XLSX.writeFile(wb, `my_invoice_${invoice.start_date}.xlsx`);
  };

  const deleteInvoice = async (invoice_id) => {
    const confirmed = window.confirm("Are you sure you want to delete this invoice?");
    if (!confirmed) return;

    const token = localStorage.getItem("auth_token");
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/invoices/delete/${invoice_id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setInvoices(prev => prev.filter(inv => inv.invoice_id !== invoice_id));
    } else {
      alert("Failed to delete invoice.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-4 text-center">My Invoices</h2>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Start Date</th>
              <th className="p-2 border">End Date</th>
              <th className="p-2 border text-right">Total</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.invoice_id} className="even:bg-gray-50">
                <td className="p-2 border">{inv.start_date}</td>
                <td className="p-2 border">{inv.end_date}</td>
                <td className="p-2 border text-right">${inv.total.toFixed(2)}</td>
                <td className="p-2 border text-center space-x-2">
                  <button
                    onClick={() => downloadInvoice(inv)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => deleteInvoice(inv.invoice_id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No invoices saved yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
