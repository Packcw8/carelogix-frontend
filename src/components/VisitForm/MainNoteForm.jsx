import React, { useState } from "react";
import CaseInfo from "./CaseInfo";
import VisitDetails from "./VisitDetails";
import ServiceCodes from "./ServiceCodes";
import TravelSegment from "./TravelSegment";
import SignatureSection from "./Signature";
import Layout from "../Layout";
import { submitForm } from "./submitForm";

export default function MainNoteForm({ onReturn }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    case_name: "",
    case_number: "",
    service_date: "",
    start_time: "",
    stop_time: "",
    location: "",
    service_provided: "",
    provider: "",
    participants: "",
    summary: "",
    skill_deficit: "",        // ✅ New field
    developed_skill: "",      // ✅ New field
    clients_progress: "",
    safety_checkbox: "",
    location_checkbox: "",
    abuse_checkbox: "",
    miles: "",
    signature: "",
    code: [],
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

  const handleSubmit = async (finalData) => {
    await submitForm({
      formData: finalData,
      segments,
      templateName: "main_note.docx",
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
      showFosterQuestions={false} // ✅ No foster questions
      showSkillInputs={true}      // ✅ Show new fields
      showProgress={true}
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
      {steps[step]}
    </Layout>
  );
}
