import React, { useEffect, useState } from "react";
import PDFModal from "../PDFModal";

const formatPrettyDate = (dateString) => {
  if (!dateString) return "Unknown";
  try {
    const [year, month, day] = dateString.split("T")[0].split("-");
    return new Date(`${year}-${month}-${day}T12:00:00`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

export default function MyForms({ onReturn }) {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterType, setFilterType] = useState("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;
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

    if (filterType === "day") {
      return d.toDateString() === selected.toDateString();
    } else if (filterType === "week") {
      const day = selected.getDay();
      const start = new Date(selected);
      start.setDate(start.getDate() - day); // Sunday
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6); // Saturday
      end.setHours(23, 59, 59, 999);
      return d >= start && d <= end;
    } else if (filterType === "month") {
      return d.getMonth() === selected.getMonth() && d.getFullYear() === selected.getFullYear();
    } else if (filterType === "year") {
      return d.getFullYear() === selected.getFullYear();
    }
    return true;
  };

  const filteredForms = forms.filter((form) => {
    if (!searchTriggered) return true;
    const matchesDate = isInDateRange(form.context?.service_date || form.service_date);
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
    const queue = forms.filter((form) => selectedFiles.has(form.id) && form.download_url_pdf);
    if (selectedFiles.size === 0) {
      alert("Please select at least one form.");
      return;
    }
    if (queue.length === 0) {
      alert("Selected forms do not have valid PDF links.");
      return;
    }
    window.open(queue[0].download_url_pdf, "_blank");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
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
            <option value="year">Year</option>
          </select>
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
          {filteredForms.map((form) => (
            <li key={form.id} className="border rounded p-4 bg-white shadow">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p><strong>Case:</strong> {form.case_name || "Unknown"}</p>
                  <p><strong>Case #:</strong> {form.case_number || "Unknown"}</p>
                  <p><strong>Type:</strong> {form.form_type}</p>
                  <p><strong>Date:</strong> {formatPrettyDate(form.context?.service_date || form.service_date)}</p>
                  <p className={`text-sm ${form.download_url_pdf ? "text-green-600" : "text-red-600"}`}>
                    <strong>PDF URL Exists:</strong> {form.download_url_pdf ? "✅" : "❌"}
                  </p>
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
                {form.download_url_docx && (
                  <a
                    href={form.download_url_docx}
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
          ))}
        </ul>
      )}

      <PDFModal
        url={selectedForm?.download_url_pdf}
        title="Form Preview"
        onClose={() => setSelectedForm(null)}
      />
    </div>
  );
}
