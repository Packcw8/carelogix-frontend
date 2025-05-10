import React from "react";

export default function TravelSegment({ segments, setSegments, onNext, onBack }) {
  const handleChange = (index, field, value) => {
    const updated = [...segments];
    updated[index][field] = value;
    setSegments(updated);
  };

  const addSegment = () => {
    setSegments([
      ...segments,
      {
        from: "",
        to: "",
        at_start_time: "",
        at_stop_time: "",
        itt_start_time: "",
        itt_stop_time: "",
      },
    ]);
  };

  const removeSegment = (index) => {
    const updated = segments.filter((_, i) => i !== index);
    setSegments(updated);
  };

  const calculateUnits = (start, stop) => {
    if (!start || !stop) return 0;
    const s = new Date(`1970-01-01T${start}`);
    const e = new Date(`1970-01-01T${stop}`);
    return Math.max(0, Math.round((e - s) / 1000 / 60 / 15));
  };

  const totalTT = segments.reduce(
    (sum, seg) => sum + calculateUnits(seg.at_start_time, seg.at_stop_time),
    0
  );
  const totalITT = segments.reduce(
    (sum, seg) => sum + calculateUnits(seg.itt_start_time, seg.itt_stop_time),
    0
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold">Step 4: Travel Segments</h2>

      {segments.map((seg, idx) => (
        <div key={idx} className="border rounded p-4 space-y-2">
          <h3 className="font-medium">Segment {idx + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="From"
              value={seg.from}
              onChange={(e) => handleChange(idx, "from", e.target.value)}
              className="input"
            />
            <input
              type="text"
              placeholder="To"
              value={seg.to}
              onChange={(e) => handleChange(idx, "to", e.target.value)}
              className="input"
            />
            <label className="block font-medium">AT Start Time
              <input
                type="time"
                value={seg.at_start_time}
                onChange={(e) => handleChange(idx, "at_start_time", e.target.value)}
                className="input"
              />
            </label>
            <label className="block font-medium">AT Stop Time
              <input
                type="time"
                value={seg.at_stop_time}
                onChange={(e) => handleChange(idx, "at_stop_time", e.target.value)}
                className="input"
              />
            </label>
            <label className="block font-medium">ITT Start Time
              <input
                type="time"
                value={seg.itt_start_time}
                onChange={(e) => handleChange(idx, "itt_start_time", e.target.value)}
                className="input"
              />
            </label>
            <label className="block font-medium">ITT Stop Time
              <input
                type="time"
                value={seg.itt_stop_time}
                onChange={(e) => handleChange(idx, "itt_stop_time", e.target.value)}
                className="input"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => removeSegment(idx)}
            className="text-red-600 text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={addSegment}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          + Add Segment
        </button>
        <div className="text-sm text-gray-700">
          Total TT Units: <strong>{totalTT}</strong> | Total ITT Units: <strong>{totalITT}</strong>
        </div>
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
