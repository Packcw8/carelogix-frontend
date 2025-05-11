import React, { useEffect, useState } from "react";
import CaseInfo from "./CaseInfo";
import VisitDetails from "./VisitDetails";
import ServiceCodes from "./ServiceCodes";
import TravelSegment from "./TravelSegment";
import SignatureSection from "./Signature";
import Layout from "../Layout";
import { submitForm } from "./submitForm"; // ✅ Make sure the path is correct

export default function MainNoteForm({ onReturn }) {
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
    code: [],
    completion_status: "",
    skill_deficit: "",
    developed_skill: "",
    participants: "",
    summary: "",
    clients_progress: "",
    safety_checkbox: "",
    location_checkbox: "",
    abuse_checkbox: "",
    miles: "",
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

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("auth_token");
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    };

    fetchClients();
  }, []);

  const handleClientSelect = (clientId) => {
    if (!clientId) {
      setFormData((prev) => ({
        ...prev,
        case_name: "",
        case_number: "",
        client_number: "",
      }));
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

  // ✅ Uses shared form logic
  const handleSubmit = async (finalData) => {
    await submitForm({
      formData: finalData,
      segments,
      templateName: "main_note_form1.docx",
      formType: "Main Note",
    });
  };

  const steps = [
    <CaseInfo formData={formData} setFormData={setFormData} onNext={() => setStep(step + 1)} />,
    <VisitDetails
      formData={formData}
      setFormData={setFormData}
      onNext={() => setStep(step + 1)}
      onBack={() => setStep(step - 1)}
      showProgress={true}
      showFosterQuestions={false}
    />,
    <ServiceCodes formData={formData} setFormData={setFormData} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <TravelSegment segments={segments} setSegments={setSegments} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <SignatureSection formData={formData} setFormData={setFormData} onBack={() => setStep(step - 1)} onSubmit={handleSubmit} />,
  ];

  return (
    <Layout title="Main Note Form">
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

