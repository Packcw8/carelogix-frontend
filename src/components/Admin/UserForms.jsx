import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../Layout";
import PDFModal from "../PDFModal";

export default function UserForms() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("week");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchForms = async () => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${apiUrl}/admin/users/${userId}/forms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setForms(data);
      } else {
        console.error("Failed to fetch forms.");
      }
    };
    fetchForms();
  }, [apiUrl, userId]);

  useEffect(() => {
    const selected = new Date(filterDate);
    const result = forms.filter((form) => {
      const d = new Date(form.service_date || form.created_at);
      const matchesSearch = `${form.case_name} ${form.case_number}`.toLowerCase().includes(search.toLowerCase());

      if (filterType === "day") {
        return d.toDateString() === selected.toDateString() && matchesSearch;
      } else if (filterType === "week") {
        const start = new Date(selected);
        const day = selected.getDay();
        start.setDate(selected.getDate() - (day === 0 ? 6 : day - 1));
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return d >= start && d <= end && matchesSearch;
      } else if (filterType === "month") {
        return d.getMonth() === selected.getMonth() && d.getFullYear() === selected.getFullYear() && matchesSearch;
      } else if (filterType === "year") {
        return d.getFullYear() === selected.getFullYear() && matchesSearch;
      }
      return matchesSearch;
    });
    setFilteredForms(result);
  }, [search, forms, filterType, filterDate]);

  return (
    <Layout title="User's Submitted Forms">
      <div className="max-w-5xl mx-auto p-4">
        <button
          onClick={() => navigate("/admin")}
          className="mb-4 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          ← Back to Admin Dashboard
        </button>

        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-full md:max-w-xs"
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>

        {filteredForms.length === 0 ? (
          <p className="text-gray-600 text-center mt-4">No forms found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredForms.map((form) => (
              <li key={form.id} className="border p-4 rounded shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p><strong>Case Name:</strong> {form.case_name}</p>
                  <p><strong>Case #:</strong> {form.case_number}</p>
                  <p><strong>Type:</strong> {form.form_type}</p>
                  <p><strong>Date:</strong> {form.service_date || form.created_at?.split("T")[0]}</p>
                </div>
                <div className="flex gap-4 mt-3 flex-wrap">
                  {form.download_url_docx && (
                    <a
                      href={form.download_url_docx}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Download DOCX
                    </a>
                  )}
                  {form.download_url_pdf && (
                    <button
                      onClick={() => setSelectedForm(form)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      View PDF
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* ✅ PDF View Modal */}
        <PDFModal
          url={selectedForm?.download_url_pdf}
          title="Form Preview"
          onClose={() => setSelectedForm(null)}
        />
      </div>
    </Layout>
  );
}
