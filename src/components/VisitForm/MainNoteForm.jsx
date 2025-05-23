import React, { useEffect, useState } from "react";
import CaseInfo from "./CaseInfo";
import VisitDetails from "./VisitDetails";
import ServiceCodes from "./ServiceCodes";
import CheckList from "./CheckList";
import TravelSegment from "./TravelSegment";
import SignatureSection from "./Signature";
import { submitForm } from "./submitForm";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// ✅ Safe human-readable date formatter
function formatPrettyDate(dateString) {
  if (!dateString) return "Unknown";
  const [year, month, day] = dateString.split("T")[0].split("-");
  return new Date(`${year}-${month}-${day}T12:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatLocalDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("T")[0].split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export default function MainNoteForm({ onReturn }) {
  const location = useLocation();
  const navigate = useNavigate();
  const passedNote = location.state?.note;

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

  const apiUrl = process.env.REACT_APP_API_URL;
  if (!apiUrl) {
    console.error("❌ REACT_APP_API_URL is not defined.");
    throw new Error("REACT_APP_API_URL is missing.");
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.full_name && !formData.provider) {
      setFormData((prev) => ({ ...prev, provider: user.full_name }));
    }
  }, []);

  useEffect(() => {
    if (passedNote) {
      setFormData((prev) => ({
        ...prev,
        case_name: passedNote.case_name || "",
        case_number: passedNote.case_number || "",
        participants: passedNote.participants || "",
        summary: passedNote.cleaned_summary || "",
        visit_details: passedNote.visit_details || "",
        service_date:
          prev.service_date && prev.service_date !== ""
            ? prev.service_date
            : formatLocalDate(passedNote.visit_date),
      }));
    }
  }, [passedNote]);

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

  const handleSubmit = async (finalData) => {
    const confirmSave = window.confirm("Are you sure you want to save?");
    if (!confirmSave) return;

    await submitForm({
      formData: finalData,
      segments,
      templateName: "main_note_form1.docx",
      formType: "Main Note",
    });

    toast.success("Form saved! Redirecting to My Forms...", {
      position: "top-right",
      autoClose: 2500,
    });

    setTimeout(() => {
      navigate("/myforms");
    }, 2600);
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
      showSkillInputs={true}
    />,
    <ServiceCodes
      formData={formData}
      setFormData={setFormData}
      onNext={() => setStep(step + 1)}
      onBack={() => setStep(step - 1)}
    />,
    <CheckList
      formData={formData}
      setFormData={setFormData}
      onNext={() => setStep(step + 1)}
      onBack={() => setStep(step - 1)}
      showFosterQuestion={false}
    />,
    <TravelSegment
      segments={segments}
      setSegments={setSegments}
      onNext={() => setStep(step + 1)}
      onBack={() => setStep(step - 1)}
    />,
    <SignatureSection
      formData={formData}
      setFormData={setFormData}
      onBack={() => setStep(step - 1)}
      onSubmit={handleSubmit}
      submitLabel="Save Form"
    />,
  ];

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

      {formData.service_date && (
        <p className="mb-4 text-gray-700">
          <strong>Selected Date:</strong> {formatPrettyDate(formData.service_date)}
        </p>
      )}

      {steps[step]}
    </div>
  );
}
