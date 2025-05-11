import React, { useState } from "react";
import CaseInfo from "./CaseInfo";
import VisitDetails from "./VisitDetails";
import ServiceCodes from "./ServiceCodes";
import CheckList from "./CheckList";
import TravelSegment from "./TravelSegment";
import SignatureSection from "./Signature";
import Layout from "../Layout"; // ✅ Adjust path if needed
import Card from "../Card";


export default function VisitForm({ onReturn }) {
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

  const handleSubmit = async () => {
    const formattedDate = new Date(formData.service_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const segmentFields = {};
    let totalTT = 0;
    let totalITT = 0;

    segments.forEach((seg, i) => {
      const index = i + 1;
      segmentFields[`location_${index * 2 - 1}`] = seg.from || "";
      segmentFields[`location_${index * 2}`] = seg.to || "";
      segmentFields[`tt_starttime${index * 2 - 1}`] = seg.at_start_time || "";
      segmentFields[`tt_starttime${index * 2}`] = seg.at_stop_time || "";
      segmentFields[`itt_starttime${index * 2 - 1}`] = seg.itt_start_time || "";
      segmentFields[`itt_starttime${index * 2}`] = seg.itt_stop_time || "";

      const calcUnits = (start, stop) => {
        if (!start || !stop) return 0;
        const s = new Date(`1970-01-01T${start}`);
        const e = new Date(`1970-01-01T${stop}`);
        return Math.max(0, Math.round((e - s) / 1000 / 60 / 15));
      };

      totalTT += calcUnits(seg.at_start_time, seg.at_stop_time);
      totalITT += calcUnits(seg.itt_start_time, seg.itt_stop_time);
    });

    const context = {
      ...formData,
      service_date: formattedDate,
      code: formData.code.join(", "),
      tt_units: totalTT.toString(),
      itt_units: totalITT.toString(),
      ...segmentFields,
    };

    const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    const token = localStorage.getItem("auth_token");

    const res = await fetch(`${apiUrl}/generate-doc`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template_name: "supervised_visit.docx",
        form_type: "Supervised Visit",
        context,
      }),
    });

    if (!res.ok) {
      alert("❌ Error generating document.");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    const safeName = formData.case_name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const safeDate = formattedDate.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    a.download = `${safeName}_${safeDate}.docx`;

    a.click();
    window.URL.revokeObjectURL(url);
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
      {steps[step]}
    </Layout>
  );
}


