import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReferralUploadForm() {
  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file.");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("auth_token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("note", note);

    const res = await fetch(`${process.env.REACT_APP_API_URL}/referrals/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setSubmitting(false);
    if (res.ok) {
      alert("Referral uploaded successfully!");
      navigate("/referrals");
    } else {
      alert("Failed to upload referral.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload Referral</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Referral File *</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700">Note (optional)</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/referrals")}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            disabled={submitting}
          >
            {submitting ? "Uploading..." : "Upload Referral"}
          </button>
        </div>
      </form>
    </div>
  );
}
