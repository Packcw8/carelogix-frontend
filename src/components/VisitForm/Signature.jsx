import React, { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";

export default function SignatureSection({ formData, setFormData }) {
  const sigCanvasRef = useRef(null);
  const [mode, setMode] = useState("draw"); // "draw" or "type"
  const [typedSig, setTypedSig] = useState("");

  const clear = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
    }
    setFormData({ ...formData, signature: "" });
  };

  const saveSignature = () => {
    if (mode === "draw" && sigCanvasRef.current) {
      const dataURL = sigCanvasRef.current.getTrimmedCanvas().toDataURL("image/png");
      setFormData({ ...formData, signature: dataURL });
    } else if (mode === "type") {
      setFormData({ ...formData, signature: typedSig });
    }
  };

  return (
    <div className="my-6">
      <h3 className="text-xl font-semibold mb-2">Signature</h3>

      <div className="mb-4 space-x-4">
        <button onClick={() => setMode("draw")} className={`px-4 py-2 rounded ${mode === "draw" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
          Draw
        </button>
        <button onClick={() => setMode("type")} className={`px-4 py-2 rounded ${mode === "type" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
          Type
        </button>
      </div>

      {mode === "draw" ? (
        <div>
          <SignaturePad
            ref={sigCanvasRef}
            canvasProps={{ className: "border w-full h-32 bg-white" }}
          />
          <div className="mt-2 flex space-x-4">
            <button onClick={clear} className="px-4 py-2 bg-red-500 text-white rounded">Clear</button>
            <button onClick={saveSignature} className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
          </div>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={typedSig}
            onChange={(e) => setTypedSig(e.target.value)}
            placeholder="Type your signature"
            className="border p-2 w-full italic text-blue-700 font-[cursive] text-lg"
          />
          <button onClick={saveSignature} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">Save</button>
        </div>
      )}

      {formData.signature && (
        <div className="mt-4">
          <h4 className="font-semibold mb-1">Saved Signature Preview:</h4>
          {formData.signature.startsWith("data:image") ? (
            <img src={formData.signature} alt="Saved Signature" className="border h-20" />
          ) : (
            <div className="italic text-blue-700 text-lg font-[cursive]">{formData.signature}</div>
          )}
        </div>
      )}
    </div>
  );
}
