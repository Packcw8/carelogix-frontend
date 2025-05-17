import React from "react";

export default function MonthlyServiceDetails({ formData, setFormData, onNext, onBack }) {
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
      <h2 className="text-xl font-semibold">Step 2: Service Details</h2>

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
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
