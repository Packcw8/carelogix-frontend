import React from "react";

const serviceCodes = [
  { label: "AT (Mileage)", value: "130107" },
  { label: "ITT", value: "130105" },
  { label: "TT", value: "130104" },
  { label: "SFT", value: "130771" },
  { label: "SVFT2", value: "130770" },
  { label: "MDT", value: "130455" },
];

export default function ServiceCodes({ formData, setFormData, onNext, onBack }) {
  const handleCodeChange = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    const updatedCodes = checked
      ? [...formData.code, value]
      : formData.code.filter((v) => v !== value);
    setFormData({ ...formData, code: updatedCodes });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold">Step: Service Codes</h2>

      <div className="grid grid-cols-2 gap-2">
        {serviceCodes.map((sc) => (
          <label key={sc.value} className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              value={sc.value}
              checked={formData.code.includes(sc.value)}
              onChange={handleCodeChange}
            />
            {`${sc.label} (${sc.value})`}
          </label>
        ))}
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
