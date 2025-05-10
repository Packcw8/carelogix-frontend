import React from "react";

export default function SignatureSection({ formData, setFormData, onBack, onSubmit }) {
  const handleChange = (e) => {
    setFormData({ ...formData, signature: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(); // this will trigger the final document generation
      }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold">Step 5: Signature</h2>

      <div>
        <label className="block font-medium">Provider Signature</label>
        <input
          type="text"
          name="signature"
          value={formData.signature || ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-1"
          placeholder="Enter full name or initials"
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
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Generate Word Document
        </button>
      </div>
    </form>
  );
}
