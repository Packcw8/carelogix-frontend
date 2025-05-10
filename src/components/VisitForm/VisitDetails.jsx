import React from "react";

export default function VisitDetails({
  formData,
  setFormData,
  onNext,
  onBack,
  showProgress = false,
  showFosterQuestions = true,
}) {
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
      <h2 className="text-xl font-semibold">Step 2: Visit Details</h2>

      <div>
        <label className="block font-medium">Provider</label>
        <input
          type="text"
          name="provider"
          value={formData.provider || ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-1"
        />
      </div>

      <div>
        <label className="block font-medium">Service Provided</label>
        <input
          type="text"
          name="service_provided"
          value={formData.service_provided || ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-1"
        />
      </div>

      <div>
        <label className="block font-medium">Participants</label>
        <input
          type="text"
          name="participants"
          value={formData.participants || ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-1"
        />
      </div>

      <div>
        <label className="block font-medium">Summary of the Visit</label>
        <textarea
          name="summary"
          value={formData.summary || ""}
          onChange={handleChange}
          rows={6}
          className="w-full border rounded px-3 py-2"
          placeholder="Describe what occurred during the visit..."
        />
      </div>

      {showProgress && (
        <div>
          <label className="block font-medium">Client’s Progress</label>
          <textarea
            name="clients_progress"
            value={formData.clients_progress || ""}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded px-3 py-2"
            placeholder="Describe client’s progress..."
          />
        </div>
      )}

      {showFosterQuestions && (
        <>
          <div>
            <label className="block font-medium">
              Did the foster parent discuss any concerns about the visits with the provider?
            </label>
            <textarea
              name="foster_concerns"
              value={formData.foster_concerns || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2"
              placeholder="Foster parent's concerns..."
            />
          </div>

          <div>
            <label className="block font-medium">
              Did the provider have any safety concerns?
            </label>
            <textarea
              name="safety_concerns"
              value={formData.safety_concerns || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2"
              placeholder="Provider's safety concerns..."
            />
          </div>

          <div>
            <label className="block font-medium">Additional Notes</label>
            <textarea
              name="additional_information"
              value={formData.additional_information || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2"
              placeholder="Optional notes about the visit..."
            />
          </div>
        </>
      )}
          <div>
  <label className="block font-medium">Total Miles Driven</label>
  <input
    type="number"
    name="miles"
    min="0"
    step="0.1"
    value={formData.miles || ""}
    onChange={(e) => setFormData({ ...formData, miles: e.target.value })}
    className="w-full border rounded px-3 py-1"
    placeholder="Enter total mileage"
  />
</div>


      <div className="flex justify-between">
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
