import React, { useEffect, useState } from "react";
import Layout from "../Layout";

export default function MyForms({ onReturn }) {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
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

  const getWeekKey = (dateStr) => {
    if (!dateStr) return "Unknown Week";
    const date = new Date(dateStr);
    const day = date.getDay();
    const offset = (day < 5 ? -((day + 2) % 7) : 5); // Friday is 5
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - offset);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
  };

  const groupedForms = forms.reduce((acc, form) => {
    const week = getWeekKey(form.service_date);
    if (!acc[week]) acc[week] = [];
    acc[week].push(form);
    return acc;
  }, {});

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

      {Object.keys(groupedForms).length === 0 ? (
        <p className="text-gray-600">No forms found.</p>
      ) : (
        Object.entries(groupedForms).map(([week, weekForms]) => (
          <div key={week} className="mb-6">
            <h3 className="text-lg font-bold mb-3 text-blue-700">{week}</h3>
            <ul className="space-y-4">
              {weekForms.map((form) => {
                const fileName = form.file_path?.split(/[\\/]/).pop();
                const safeName = (form.case_name || "case").replace(/[^a-z0-9]/gi, "_").toLowerCase();
                const safeDate = (form.service_date || "date").replace(/[^a-z0-9]/gi, "_").toLowerCase();
                const displayName = `${safeName}_${safeDate}.docx`;

                return (
                  <li key={form.id} className="border rounded p-4 bg-white shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <p><strong>Case:</strong> {form.case_name || "Unknown"}</p>
                      <p><strong>Case #:</strong> {form.case_number || "Unknown"}</p>
                      <p><strong>Type:</strong> {form.form_type}</p>
                      <p><strong>Date:</strong> {form.service_date || "Unknown"}</p>
                    </div>

                    <div className="flex gap-4 mt-3 flex-wrap">
                      {fileName && (
                        <a
                          href={`${apiUrl}/generated_docs/${fileName}`}
                          download={displayName}
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
          </div>
        ))
      )}

      {selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-2xl w-full overflow-auto max-h-[90vh]">
            <h2 className="text-lg font-bold mb-2">Form Preview</h2>
            <pre className="text-sm whitespace-pre-wrap break-words bg-gray-100 p-4 rounded max-h-[70vh] overflow-auto">
              {JSON.stringify(selectedForm.context, null, 2)}
            </pre>
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





