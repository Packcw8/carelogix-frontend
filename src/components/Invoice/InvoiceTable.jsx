import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const serviceCodes = [
  { label: "AT (Mileage)", value: "130107" },
  { label: "ITT", value: "130105" },
  { label: "TT", value: "130104" },
  { label: "SFT", value: "130771" },
  { label: "SVFT2", value: "130770" },
  { label: "MDT", value: "130455" },
  { label: "Adult Skill Building", value: "130390" },
  { label: "Home Study", value: "120150" },
  { label: "Individulized Parenting", value: "130300" },
  { label: "Court Attendance", value: "130755" },
];

const payTiers = {
  "Tier 1": { "130107": 0.66, "130105": 20, "130104": 20, "130771": 20, "130770": 20, "130455": 20, "130390": 20, "120150": 20, "130300": 20, "130755": 20 },
  "Tier 2": { "130107": 0.66, "130105": 24, "130104": 24, "130771": 24, "130770": 24, "130455": 24, "130390": 24, "120150": 24, "130300": 24, "130755": 24 },
  "Tier 3": { "130107": 0.66, "130105": 28, "130104": 28, "130771": 28, "130770": 28, "130455": 28, "130390": 28, "120150": 28, "130300": 28, "130755": 28 },
};

export default function InvoiceTable() {
  const [invoiceData, setInvoiceData] = useState(() => {
    const saved = localStorage.getItem("invoiceDataTemp");
    return saved ? JSON.parse(saved) : [];
  });
  const [clients, setClients] = useState([]);
  const [tier, setTier] = useState("Tier 1");
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const friday = new Date(today.setDate(today.getDate() - ((today.getDay() + 1) % 7)));
    return friday.toISOString().split("T")[0];
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("auth_token");
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const fetchClients = async () => {
    const res = await fetch(`${apiUrl}/clients`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setClients(data);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    localStorage.setItem("invoiceDataTemp", JSON.stringify(invoiceData));
  }, [invoiceData]);

  const handleEdit = (index, field, value) => {
    const updated = [...invoiceData];
    if (field === "client_name") {
      const selectedClient = clients.find(c => c.case_name === value);
      updated[index]["client_name"] = value;
      updated[index]["case_number"] = selectedClient?.case_number || "";
      updated[index]["client_number"] = selectedClient?.client_number || "";
    } else if (field === "service_code") {
      updated[index]["service_code"] = value;
      const rate = payTiers[tier]?.[value] || 0;
      updated[index]["rate"] = rate;
    } else {
      updated[index][field] = field === "units" || field === "rate" ? parseFloat(value) || 0 : value;
    }
    updated[index].total = +(updated[index].units * updated[index].rate).toFixed(2);
    setInvoiceData(updated);
  };

  const deleteRow = (index) => {
    const updated = [...invoiceData];
    updated.splice(index, 1);
    setInvoiceData(updated);
  };

  const addRow = () => {
    setInvoiceData([...invoiceData, {
      client_name: "",
      service: "",
      service_code: "",
      case_number: "",
      client_number: "",
      units: 0,
      rate: 0,
      total: 0,
    }]);
  };

  const totalSum = invoiceData.reduce((sum, row) => sum + (row.total || 0), 0);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <button onClick={() => navigate("/dashboard")} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">← Back to Dashboard</button>
        <div>
          <label className="mr-2 font-medium">Pay Tier:</label>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="Tier 1">Tier 1</option>
            <option value="Tier 2">Tier 2</option>
            <option value="Tier 3">Tier 3</option>
          </select>
        </div>
      </div>

      <table className="min-w-full bg-white text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Client</th>
            <th className="p-2 border">Service</th>
            <th className="p-2 border">Code</th>
            <th className="p-2 border">Case #</th>
            <th className="p-2 border">Client #</th>
            <th className="p-2 border">Units</th>
            <th className="p-2 border">Rate</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.map((row, i) => (
            <tr key={i} className="even:bg-gray-50">
              <td className="p-2 border">
                <select
                  value={row.client_name}
                  onChange={(e) => handleEdit(i, "client_name", e.target.value)}
                  className="w-40 border px-1 rounded"
                >
                  <option value="">Select</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.case_name}>{c.case_name}</option>
                  ))}
                </select>
              </td>
              <td className="p-2 border">
                <input
                  value={row.service}
                  onChange={(e) => handleEdit(i, "service", e.target.value)}
                  className="w-36 border px-1 rounded"
                />
              </td>
              <td className="p-2 border">
                <select
                  value={row.service_code}
                  onChange={(e) => handleEdit(i, "service_code", e.target.value)}
                  className="w-32 border px-1 rounded"
                >
                  <option value="">Select</option>
                  {serviceCodes.map((s) => (
                    <option key={s.value} value={s.value}>{`${s.label} (${s.value})`}</option>
                  ))}
                </select>
              </td>
              <td className="p-2 border">
                <input
                  value={row.case_number}
                  readOnly
                  className="w-24 border px-1 rounded"
                />
              </td>
              <td className="p-2 border">
                <input
                  value={row.client_number}
                  readOnly
                  className="w-24 border px-1 rounded"
                />
              </td>
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
              <td className="p-2 border text-center">
                <button
                  onClick={() => deleteRow(i)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr className="bg-gray-100 font-semibold">
            <td colSpan="7" className="p-2 text-right border">Total:</td>
            <td className="p-2 border text-right">${totalSum.toFixed(2)}</td>
            <td className="p-2 border"></td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 text-center">
        <button
          onClick={() => setInvoiceData([])}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded mr-4"
        >
          Clear Table
        </button>
        <button
          onClick={() => alert("Save logic goes here")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded text-lg"
        >
          Finalize & Save to My Invoices
        </button>
      </div>
    </div>
  );
}
