import React, { useEffect, useState } from "react";
import Layout from "../Layout"; // ✅ adjust path if needed

export default function MyForms({ onReturn }) {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:8000/forms/mine", {
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
    const token = localStorage.getItem("token");
    const confirmed = window.confirm("Are you sure you want to delete this form?");
    if (!confirmed) return;

    const res = await fetch(`http://127.0.0.1:8000/forms/${formId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setForms(forms.filter((f) => f.id !== formId));
    } else {
      alert("❌ Failed to delete form.");
    }
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

      {forms.length === 0 ? (
        <p className="text-gray-600">No forms found.</p>
      ) : (
        <ul className="space-y-4">
          {forms.map((form) => {
            const fileName = form.file_path.split("\\").pop();
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
                  <a
                    href={`http://127.0.0.1:8000/generated_docs/${fileName}`}
                    download={displayName}
                    className="text-blue-600 underline"
                  >
                    Download
                  </a>
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
    </Layout>
  );
}







