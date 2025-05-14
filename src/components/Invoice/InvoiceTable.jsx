import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

export default function InvoiceTable() {
  const [invoiceData, setInvoiceData] = useState([]);
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const friday = new Date(today.setDate(today.getDate() - ((today.getDay() + 1) % 7)));
    return friday.toISOString().split("T")[0];
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchInvoice = async () => {
    const token = localStorage.getItem("auth_token");
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/generate-invoice?week_start=${weekStart}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setInvoiceData(data);
    } else {
      alert("Failed to load invoice data.");
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [weekStart]);

  const handleEdit = (index, field, value) => {
    const updated = [...invoiceData];
    updated[index][field] = parseFloat(value) || 0;
    updated[index].total = +(updated[index].units * updated[index].rate).toFixed(2);
    setInvoiceData(updated);
  };

  const totalSum = invoiceData.reduce((sum, row) => sum + (row.total || 0), 0);

  const downloadExcel = () => {
    const fullName = user?.full_name || "Unknown";
    const agency = user?.agency?.name || "Unknown Agency";
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const formatDate = (date) =>
      date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const payrollRange = `${formatDate(start)} – ${formatDate(end)}`;

    const header = [
      ["Provider:", fullName],
      ["Agency:", agency],
      ["Payroll Period:", payrollRange],
      [],
      ["Client", "Service", "Code", "Case #", "Client #", "Units", "Rate", "Total"],
    ];

    const rows = invoiceData.map((row) => [
      row.client_name,
      row.service,
      row.service_code,
      row.case_number,
      row.client_number,
      row.units,
      row.rate,
      row.total,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([...header, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice");
    XLSX.writeFile(workbook, `invoice_${weekStart}.xlsx`);
  };

  const finalizeAndSave = async () => {
    const token = localStorage.getItem("auth_token");
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const response = await fetch(`${apiUrl}/save-invoice?start_date=${weekStart}&end_date=${end.toISOString().split("T")[0]}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    });

    if (response.ok) {
      alert("✅ Invoice saved! You can now view it in 'My Invoices'.");
    } else {
      alert("❌ Failed to save invoice.");
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

      <h2 className="text-2xl font-bold mb-4 text-center">Weekly Invoice</h2>

      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        <label className="font-medium">Week of:</label>
        <input
          type="date"
          className="border px-2 py-1 rounded"
          value={weekStart}
          onChange={(e) => setWeekStart(e.target.value)}
        />
        <button
          onClick={fetchInvoice}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
        <button
          onClick={downloadExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Download Excel
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Client</th>
              <th className="p-2 border">Service</th>
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Case #</th>
              <th className="p-2 border">Client #</th>
              <th className="p-2 border">Units</th>
              <th className="p-2 border">Rate</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.map((row, i) => (
              <tr key={i} className="even:bg-gray-50">
                <td className="p-2 border">{row.client_name}</td>
                <td className="p-2 border">{row.service}</td>
                <td className="p-2 border">{row.service_code}</td>
                <td className="p-2 border">{row.case_number}</td>
                <td className="p-2 border">{row.client_number}</td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={row.units}
                    onChange={(e) => handleEdit(i, "units", e.target.value)}
                    className="w-20 border px-1 rounded"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={row.rate}
                    onChange={(e) => handleEdit(i, "rate", e.target.value)}
                    className="w-20 border px-1 rounded"
                  />
                </td>
                <td className="p-2 border text-right">${row.total.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-semibold">
              <td colSpan="7" className="p-2 text-right border">Total:</td>
              <td className="p-2 border text-right">${totalSum.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={finalizeAndSave}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded text-lg"
        >
          Finalize & Save to My Invoices
        </button>
      </div>
    </div>
  );
}
