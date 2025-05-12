import React from "react";

export default function CheckList({ formData, setFormData, onNext, onBack, showFosterQuestion = true }) {
  const handleSelectChange = (e) => {
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
      <h2 className="text-xl font-semibold">Step 4: Visit Checklist</h2>

      <div>
        <label className="block font-medium">Did the parent supply child’s needs?</label>
        <select
          name="suplyneeds_checkbox"
          value={formData.suplyneeds_checkbox || "no"}
          onChange={handleSelectChange}
          className="w-full border rounded px-3 py-1"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Did the family follow visitation rules?</label>
        <select
          name="rules_checkbox"
          value={formData.rules_checkbox || "no"}
          onChange={handleSelectChange}
          className="w-full border rounded px-3 py-1"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      {showFosterQuestion && (
        <div>
          <label className="block font-medium">Did you speak with the foster parent?</label>
          <select
            name="fosterspeak_checkbox"
            value={formData.fosterspeak_checkbox || "no"}
            onChange={handleSelectChange}
            className="w-full border rounded px-3 py-1"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      )}

      <div>
        <label className="block font-medium">Safety Concerns?</label>
        <select
          name="safety_checkbox"
          value={formData.safety_checkbox || "no"}
          onChange={handleSelectChange}
          className="w-full border rounded px-3 py-1"
        >
          <option value="yes">*</option>
          <option value="no">No</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Location Concerns?</label>
        <select
          name="location_checkbox"
          value={formData.location_checkbox || "no"}
          onChange={handleSelectChange}
          className="w-full border rounded px-3 py-1"
        >
          <option value="yes">*</option>
          <option value="no">No</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Abuse Concerns?</label>
        <select
          name="abuse_checkbox"
          value={formData.abuse_checkbox || "no"}
          onChange={handleSelectChange}
          className="w-full border rounded px-3 py-1"
        >
          <option value="yes">*</option>
          <option value="no">No</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Safety Observation Summary</label>
        <select
          name="safety_observation"
          value={formData.safety_observation || ""}
          onChange={handleSelectChange}
          className="w-full border rounded px-3 py-1"
        >
          <option value="">-- Select --</option>
          <option value="*Safety Concerns">*Safety Concerns</option>
          <option value="*No Safety Concerns">*No Safety Concerns</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Abuse Observation Summary</label>
        <select
          name="abuse_observation"
          value={formData.abuse_observation || ""}
          onChange={handleSelectChange}
          className="w-full border rounded px-3 py-1"
        >
          <option value="">-- Select --</option>
          <option value="*Abuse or Neglect">*Abuse or Neglect</option>
          <option value="*No Abuse or Neglect">*No Abuse or Neglect</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Location Context</label>
        <select
          name="location_context"
          value={formData.location_context || ""}
          onChange={handleSelectChange}
          className="w-full border rounded px-3 py-1"
        >
          <option value="">-- Select --</option>
          <option value="*Home">*Home</option>
          <option value="*DHHR">*DHHR</option>
          <option value="*Court">*Court</option>
          <option value="*Other">*Other</option>
        </select>
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
