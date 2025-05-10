import React from "react";

export default function CaseInfo({ formData, setFormData, onNext }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold">Step 1: Case Information</h2>

      {["case_name", "case_number", "service_date", "start_time", "stop_time", "location"].map((key) => (
        <div key={key}>
          <label className="block font-medium capitalize">{key.replace(/_/g, " ")}</label>
          <input
            type={key.includes("date") ? "date" : key.includes("time") ? "time" : "text"}
            name={key}
            value={formData[key] || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-1"
          />
        </div>
      ))}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Continue
      </button>
    </form>
  );
}
