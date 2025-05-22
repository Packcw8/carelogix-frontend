import React from "react";
import { fetchClientSummaries } from "./fetchClientSummaries"; // Adjust path if needed

export default function MonthlyServiceDetails({ formData, setFormData, onNext, onBack }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoadSummaries = async () => {
    if (!formData.case_name || !formData.service_month) {
      alert("❌ Please select both a client and service month.");
      return;
    }

    // 🧠 DEBUGGING OUTPUT
    console.log("📤 Client Name:", formData.case_name);
    console.log("📤 Service Month:", formData.service_month);

    try {
      const data = await fetchClientSummaries(formData.case_name, formData.service_month);
      console.log("📥 Summary API Response:", data);

      setFormData({
        ...formData,
        summaries: data.summaries.join("\n\n"),
        service_dates: data.service_dates.join(", "),
        participants: data.participants.join(", "),
        mileage: data.mileage,
      });

      alert(`✅ Loaded ${data.summaries.length} summaries.`);
    } catch (error) {
      alert("❌ Failed to load data from the server.");
      console.error("Fetch error:", error);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold">Step 2: Service Details</h2>

      <button
        type="button"
        onClick={handleLoadSummaries}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        🔄 Load Previous Visit Data
      </button>

      <div>
        <label className="block font-medium">Service Dates</label>
        <input
          type="text"
          name="service_dates"
          value={formData.service_dates || ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="E.g. May 1, 3, 5, 10, 14"
        />
      </div>

      <div>
        <label className="block font-medium">Mileage</label>
        <input
          type="number"
          name="mileage"
          value={formData.mileage || ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Total mileage for the month"
        />
      </div>

      <div>
        <label className="block font-medium">Participants</label>
        <input
          type="text"
          name="participants"
          value={formData.participants || ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="List of participants"
        />
      </div>

      <div>
        <label className="block font-medium">Summaries of Services</label>
        <textarea
          name="summaries"
          value={formData.summaries || ""}
          onChange={handleChange}
          rows={8}
          className="w-full border rounded px-3 py-2"
          placeholder="Auto-filled or manually entered summaries of all services"
        />
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Continue →
        </button>
      </div>
    </form>
  );
}
