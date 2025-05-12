import React, { useState, useEffect } from "react";
import CaseInfo from "./CaseInfo";
import VisitDetails from "./VisitDetails";
import ServiceCodes from "./ServiceCodes";
import CheckList from "./CheckList";
import TravelSegment from "./TravelSegment";
import SignatureSection from "./Signature";
import Layout from "../Layout";
import Card from "../Card";
import { submitForm } from "./submitForm";

export default function VisitForm({ onReturn }) {
  const [step, setStep] = useState(0);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    case_name: "",
    case_number: "",
    client_number: "",
    service_date: "",
    start_time: "",
    stop_time: "",
    location: "",
    service_provided: "",
    provider: "",
    participants: "",
    summary: "",
    suplyneeds_checkbox: false,
    rules_checkbox: false,
    fosterspeak_checkbox: false,
    foster_concerns: "",
    safety_concerns: "",
    additional_information: "",
    miles: "",
    code: [],
    signature: "",
  });

  const [segments, setSegments] = useState([
    {
      from: "",
      to: "",
      at_start_time: "",
      at_stop_time: "",
      itt_start_time: "",
      itt_stop_time: "",
    },
  ]);

  const apiUrl = process.env.REACT_APP_API_URL;
  if (!apiUrl) {
    console.error("❌ REACT_APP_API_URL is not defined. Check your .env and Vercel settings.");
    throw new Error("REACT_APP_API_URL is missing.");
  }
  console.log("👥 Fetching clients from:", apiUrl);

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

  const handleClientSelect = (clientId) => {
    if (!clientId) {
      setFormData({ ...formData, case_name: "", case_number: "", client_number: "" });
      return;
    }

    const selected = clients.find((c) => c.id === clientId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        case_name: selected.case_name,
        case_number: selected.case_number,
        client_number: selected.client_number,
      }));
    }
  };

  const handleSubmit = async (finalData) => {
    await submitForm({
      formData: finalData,
      segments,
      templateName: "supervised_visit.docx",
      formType: "Supervised Visit",
    });
  };

  const steps = [
    <CaseInfo formData={formData} setFormData={setFormData} onNext={() => setStep(step + 1)} />,
    <VisitDetails formData={formData} setFormData={setFormData} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <ServiceCodes formData={formData} setFormData={setFormData} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <CheckList formData={formData} setFormData={setFormData} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <TravelSegment segments={segments} setSegments={setSegments} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <SignatureSection formData={formData} setFormData={setFormData} onBack={() => setStep(step - 1)} onSubmit={handleSubmit} />,
  ];

  return (
    <Layout title="Supervised Visit Form">
      {onReturn && (
        <button
          onClick={onReturn}
          className="mb-4 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          ← Return to Dashboard
        </button>
      )}

      <div className="mb-4">
        <label className="block font-medium mb-1">Select Client (optional)</label>
        <select
          className="border px-3 py-2 rounded w-full"
          onChange={(e) => handleClientSelect(e.target.value)}
        >
          <option value="">-- Fill out manually --</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.case_name} ({client.case_number})
            </option>
          ))}
        </select>
      </div>

      {steps[step]}
    </Layout>
  );
}

