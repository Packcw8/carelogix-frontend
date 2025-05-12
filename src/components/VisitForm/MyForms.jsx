import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function MyForms({ onReturn }) {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterType, setFilterType] = useState("week");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;
  if (!apiUrl) {
    console.error("❌ REACT_APP_API_URL is not defined. Check your .env and Vercel settings.");
    throw new Error("REACT_APP_API_URL is missing.");
  }

  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    const res = await fetch(`${apiUrl}/forms/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setForms(data);
    } else {
      alert("❌ Failed to load forms.");
    }
  };

  const handleDelete = async (formId) => {
    const confirmed = window.confirm("Are you sure you want to delete this form?");
    if (!confirmed) return;

    const res = await fetch(`${apiUrl}/forms/${formId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setForms(forms.filter((f) => f.id !== formId));
    } else {
      alert("❌ Failed to delete form.");
    }
  };

  const isInDateRange = (formDate) => {
    const d = new Date(formDate);
    const selected = new Date(filterDate);
    if (isNaN(d) || isNaN(selected)) return false;

    if (d.getFullYear() !== Number(filterYear)) return false;

    if (filterType === "day") {
      return d.toDateString() === selected.toDateString();
    } else if (filterType === "week") {
      const day = selected.getDay();
      const offset = (day < 5 ? -((day + 2) % 7) : 5);
      const start = new Date(selected);
      start.setDate(selected.getDate() - offset);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return d >= start && d <= end;
    } else if (filterType === "month") {
      return d.getMonth() === selected.getMonth();
    }
    return false;
  };

  const filteredForms = forms.filter((form) => {
    if (!searchTriggered) return true;
    const matchesDate = isInDateRange(form.service_date);
    const matchesSearch = [form.case_name, form.case_number]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesDate && matchesSearch;
  });

  const toggleSelect = (formId) => {
    setSelectedFiles((prev) => {
      const updated = new Set(prev);
      updated.has(formId) ? updated.delete(formId) : updated.add(formId);
      return updated;
    });
  };

  const handlePrintSelected = () => {
    const urls = forms
      .filter((form) => selectedFiles.has(form.id))
      .map((form) => `https://carelogix-docs.s3.us-east-2.amazonaws.com/${form.file_path.replace(".docx", ".pdf")}`);

    urls.forEach((url) => {
      const win = window.open(url);
      if (win) win.print();
    });
  };

  return (
    <Layout title="My Submitted Forms">
      {onReturn && (
        <button
          onClick={onReturn}
          className="mb-4 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          ← Return to Dashboard
        </button>
      )}

      <div className="mb-4 space-y-4">
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Search by name or case number:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Juanita or 123456"
              className="border p-2 rounded w-full max-w-xs"
            />
            <button
              onClick={() => setSearchTriggered(true)}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700">Select a date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border p-2 rounded w-full max-w-xs"
          />
        </div>

        <div>
          <label className="block font-semibold mt-2 mb-1 text-gray-700">Filter by:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border p-2 rounded w-full max-w-xs"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mt-2 mb-1 text-gray-700">Filter by year:</label>
          <input
            type="number"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="border p-2 rounded w-full max-w-xs"
            min="2000"
            max={new Date().getFullYear() + 1}
          />
        </div>

        {selectedFiles.size > 0 && (
          <div>
            <button
              onClick={handlePrintSelected}
              className="mt-2 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
            >
              Print Selected ({selectedFiles.size})
            </button>
          </div>
        )}
      </div>

      {filteredForms.length === 0 ? (
        <p className="text-gray-600">No forms found for the selected range.</p>
      ) : (
        <ul className="space-y-4">
          {filteredForms.map((form) => {
            const fileName = form.file_path?.split(/[\\/]/).pop();

            return (
              <li key={form.id} className="border rounded p-4 bg-white shadow">
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <p><strong>Case:</strong> {form.case_name || "Unknown"}</p>
                    <p><strong>Case #:</strong> {form.case_number || "Unknown"}</p>
                    <p><strong>Type:</strong> {form.form_type}</p>
                    <p><strong>Date:</strong> {form.service_date || "Unknown"}</p>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(form.id)}
                      onChange={() => toggleSelect(form.id)}
                      className="h-5 w-5 mt-2"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-3 flex-wrap">
                  {fileName && (
                    <a
                      href={`https://carelogix-docs.s3.us-east-2.amazonaws.com/${fileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Download
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedForm(form)}
                    className="text-green-600 underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="text-red-600 underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-3xl w-full overflow-auto max-h-[90vh]">
            <h2 className="text-lg font-bold mb-4">Form Preview</h2>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <div className="h-[70vh] overflow-auto border rounded">
                <Viewer
                  fileUrl={`https://carelogix-docs.s3.us-east-2.amazonaws.com/${selectedForm.file_path.replace(".docx", ".pdf")}`}
                />
              </div>
            </Worker>
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedForm(null)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
