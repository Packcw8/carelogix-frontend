import React, { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";

export default function SignatureSection({ formData, setFormData, onBack, onSubmit }) {
  const sigCanvasRef = useRef(null);
  const [mode, setMode] = useState(formData.signature?.startsWith("data:image") ? "draw" : "type");
  const [typedSig, setTypedSig] = useState(
    formData.signature?.startsWith("data:image") ? "" : formData.signature || ""
  );

  const clear = () => {
    if (sigCanvasRef.current) sigCanvasRef.current.clear();
    setFormData({ ...formData, signature: "" });
    setTypedSig("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build signature into a new object before submitting
    let updatedData = { ...formData };
    if (mode === "draw" && sigCanvasRef.current) {
      const dataURL = sigCanvasRef.current.getTrimmedCanvas().toDataURL("image/png");
      updatedData.signature = dataURL;
    } else if (mode === "type") {
      updatedData.signature = typedSig;
    }

    setFormData(updatedData);  // Update React state
    onSubmit(updatedData);     // Submit with correct signature included
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Step 5: Signature</h2>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setMode("draw")}
          className={`px-4 py-2 rounded ${mode === "draw" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Draw
        </button>
        <button
          type="button"
          onClick={() => setMode("type")}
          className={`px-4 py-2 rounded ${mode === "type" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Type
        </button>
      </div>

      {mode === "draw" ? (
        <div>
          <label className="block font-medium mb-1">Draw Signature</label>
          <SignaturePad
            ref={sigCanvasRef}
            canvasProps={{ className: "border w-full h-32 bg-white rounded" }}
          />
          <div className="mt-2 flex gap-3">
            <button type="button" onClick={clear} className="bg-red-500 text-white px-4 py-1 rounded">Clear</button>
          </div>
        </div>
      ) : (
        <div>
          <label className="block font-medium mb-1">Typed Signature</label>
          <input
            type="text"
            value={typedSig}
            onChange={(e) => setTypedSig(e.target.value)}
            placeholder="Enter your full name or initials"
            className="border p-2 w-full italic text-blue-700 font-[cursive] text-lg"
          />
        </div>
      )}

      {formData.signature && (
        <div className="mt-4">
          <label className="block font-semibold mb-1">Saved Signature Preview:</label>
          {formData.signature.startsWith("data:image") ? (
            <img src={formData.signature} alt="Signature" className="border h-20" />
          ) : (
            <div className="italic text-blue-700 text-lg font-[cursive]">{formData.signature}</div>
          )}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack} className="bg-gray-400 text-white px-4 py-2 rounded">
          Back
        </button>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Generate Word Document
        </button>
      </div>
    </form>
  );
}


