import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function PDFModal({ url, title, onClose, buttonText = "Close" }) {
  if (!url) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-3xl w-full overflow-auto max-h-[90vh]">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <div className="h-[70vh] overflow-auto border rounded">
            <Viewer fileUrl={url} />
          </div>
        </Worker>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
