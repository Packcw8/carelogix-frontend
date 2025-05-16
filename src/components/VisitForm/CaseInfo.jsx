import React from "react";

function generateTimeOptions() {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const date = new Date(0, 0, 0, hour, min);
      const value = date.toTimeString().slice(0, 5); // "HH:MM"
      const label = date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }); // "1:15 PM"
      options.push({ value, label });
    }
  }
  return options;
}

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

      {["case_name", "case_number", "client_number", "service_date", "start_time", "stop_time", "location"].map((key) => (
        <div key={key}>
          <label className="block font-medium capitalize">
            {key.replace(/_/g, " ")}
          </label>

          {key.includes("time") ? (
            <select
              name={key}
              value={formData[key] || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
            >
              <option value="">-- Select Time --</option>
              {generateTimeOptions().map((time) => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={key.includes("date") ? "date" : "text"}
              name={key}
              value={formData[key] || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
            />
          )}
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
