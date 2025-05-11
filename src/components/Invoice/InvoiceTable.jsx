import React, { useEffect, useState } from "react";

export default function InvoiceTable() {
  const [invoiceData, setInvoiceData] = useState([]);
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    return monday.toISOString().split("T")[0];
  });

  const fetchInvoice = async () => {
    const token = localStorage.getItem("auth_token");
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/generate-invoice?week_start=${weekStart}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Weekly Invoice</h2>

      <div className="mb-4 flex items-center justify-center gap-2">
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
      </div>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Client</th>
              <th className="p-2 border">Service</th>
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Case #</th>
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
              <td colSpan="6" className="p-2 text-right border">Total:</td>
              <td className="p-2 border text-right">${totalSum.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
