import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { submitForm } from "../VisitForm/submitForm";
import 'react-toastify/dist/ReactToastify.css';

export default function MonthlySummaryForm({ onReturn }) {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    case_name: "",
    case_number: "",
    client_number: "",
    caseworker_name: "",
    caseworker_email: "",
    summaries: "",
    service_dates: "",
    participants: "",
    mileage: "",
  });

  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${apiUrl}/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      } else {
        console.error("❌ Failed to fetch clients.");
      }
    };
    fetchClients();
  }, [apiUrl]);

  const handleClientSelect = async (clientId) => {
    const selected = clients.find((c) => c.id === clientId);
    if (!selected) return;

    const token = localStorage.getItem("auth_token");
    const clientName = encodeURIComponent(selected.case_name);
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM

    const res = await fetch(`${apiUrl}/summaries/${clientName}/${currentMonth}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const summaryData = res.ok ? await res.json() : {};

    setFormData((prev) => ({
      ...prev,
      case_name: selected.case_name,
      case_number: selected.case_number,
      client_number: selected.client_number,
      caseworker_name: selected.caseworker_name || "",
      caseworker_email: selected.worker_email || "",
      summaries: (summaryData.summaries || []).join("\n\n"),
      service_dates: (summaryData.service_dates || []).join(", "),
      participants: (summaryData.participants || []).join(", "),
      mileage: summaryData.mileage || "0",
    }));
  };

  const handleSubmit = async () => {
    const confirmSave = window.confirm("Submit Monthly Summary?");
    if (!confirmSave) return;

    await submitForm({
      formData,
      templateName: "monthly_summary.docx",
      formType: "Monthly Summary",
    });

    toast.success("Monthly Summary saved!", {
      position: "top-right",
      autoClose: 2500,
    });

    setTimeout(() => {
      navigate("/myforms");
    }, 2600);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <ToastContainer />
      {onReturn && (
        <button
          onClick={onReturn}
          className="mb-4 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          ← Return to Dashboard
        </button>
      )}

      <h2 className="text-2xl font-bold mb-4">Monthly Summary Form</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Select Client</label>
        <select
          className="border px-3 py-2 rounded w-full"
          onChange={(e) => handleClientSelect(e.target.value)}
        >
          <option value="">-- Select --</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.case_name} ({client.case_number})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 mb-6">
        <p><strong>Case Name:</strong> {formData.case_name}</p>
        <p><strong>Case Number:</strong> {formData.case_number}</p>
        <p><strong>Caseworker:</strong> {formData.caseworker_name} ({formData.caseworker_email})</p>
        <p><strong>Client #:</strong> {formData.client_number}</p>
        <p><strong>Service Dates:</strong> {formData.service_dates}</p>
        <p><strong>Participants:</strong> {formData.participants}</p>
        <p><strong>Total Mileage:</strong> {formData.mileage} mi</p>
        <div>
          <strong>Summaries:</strong>
          <pre className="whitespace-pre-wrap border p-2 bg-gray-100 rounded">{formData.summaries}</pre>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Save Monthly Summary
      </button>
    </div>
  );
}
