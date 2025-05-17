import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { submitForm } from "../VisitForm/submitForm";
import MonthlyClientInfo from "./MonthlyClientInfo";
import MonthlyServiceDetails from "./MonthlyServiceDetails";
import MonthlyReview from "./MonthlyReview";
import SignatureSection from "../VisitForm/Signature";
import "react-toastify/dist/ReactToastify.css";

export default function MonthlySummaryForm({ onReturn }) {
  const [clients, setClients] = useState([]);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    case_name: "",
    case_number: "",
    client_number: "",
    caseworker_name: "",
    caseworker_email: "",
    service_month: "",
    service_dates: "",
    participants: "",
    summaries: "",
    mileage: "",
    treatment_goals: "",
    safety_threats: "",
    life_events: "",
    focus: "",
    recommendations: "",
    signature: ""
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
      }
    };
    fetchClients();
  }, [apiUrl]);

  const handleSubmit = async (finalData) => {
    const confirm = window.confirm("Submit Monthly Summary?");
    if (!confirm) return;

    await submitForm({
      formData: {
        ...finalData,
        service_date: finalData.service_month || new Date().toISOString().split("T")[0]
      },
      segments: [],
      templateName: "monthlysummary.docx",
      formType: "Monthly Summary",
    });

    toast.success("Monthly Summary saved!", {
      position: "top-right",
      autoClose: 2500,
    });

    setTimeout(() => navigate("/myforms"), 2600);
  };

  const steps = [
    <MonthlyClientInfo
      formData={formData}
      setFormData={setFormData}
      clients={clients}
      onNext={() => setStep(step + 1)}
    />,
    <MonthlyServiceDetails
      formData={formData}
      setFormData={setFormData}
      onNext={() => setStep(step + 1)}
      onBack={() => setStep(step - 1)}
    />,
    <MonthlyReview
      formData={formData}
      setFormData={setFormData}
      onNext={() => setStep(step + 1)}
      onBack={() => setStep(step - 1)}
    />,
    <SignatureSection
      formData={formData}
      setFormData={setFormData}
      onBack={() => setStep(step - 1)}
      onSubmit={handleSubmit}
    />
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

      {steps[step]}
    </div>
  );
}