import React from "react";

export default function MonthlyReview({ formData, setFormData, onNext, onBack }) {
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
      <h2 className="text-xl font-semibold">Step 3: Review & Recommendations</h2>

      <div>
        <label className="block font-medium">Treatment Goals</label>
        <textarea
          name="treatment_goals"
          value={formData.treatment_goals || ""}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded px-3 py-2"
          placeholder="Goals from the case plan and updates on each"
        />
      </div>

      <div>
        <label className="block font-medium">Safety Threats</label>
        <textarea
          name="safety_threats"
          value={formData.safety_threats || ""}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded px-3 py-2"
          placeholder="Changes in safety threats from safety plan"
        />
      </div>

      <div>
        <label className="block font-medium">Significant Life Events</label>
        <textarea
          name="life_events"
          value={formData.life_events || ""}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded px-3 py-2"
          placeholder="Major family or client life changes this month"
        />
      </div>

      <div>
        <label className="block font-medium">Focus for Next Service Period</label>
        <textarea
          name="focus"
          value={formData.focus || ""}
          onChange={handleChange}
          rows={2}
          className="w-full border rounded px-3 py-2"
          placeholder="Goals or areas of focus for upcoming visits"
        />
      </div>

      <div>
        <label className="block font-medium">Recommendations for BSS</label>
        <textarea
          name="recommendations"
          value={formData.recommendations || ""}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded px-3 py-2"
          placeholder="Suggestions related to case goals and services"
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