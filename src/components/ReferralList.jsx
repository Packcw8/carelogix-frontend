import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PDFModal from "./PDFModal";


export default function ReferralList() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(`${process.env.REACT_APP_API_URL}/referrals/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch referrals");
        const data = await res.json();
        setReferrals(data);
      } catch (err) {
        console.error("Error fetching referrals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  if (loading) return <p className="text-center mt-6 text-gray-500">Loading referrals...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Dashboard
        </button>
        <button
          onClick={() => navigate("/referrals/upload")}
          className="bg-orange-500 text-white text-sm px-4 py-2 rounded-xl hover:bg-orange-600"
        >
          + Upload Referral
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">My Referrals</h2>

      {referrals.length === 0 ? (
        <p className="text-center text-gray-600">No referrals found.</p>
      ) : (
        <ul className="space-y-4">
          {referrals.map((ref) => (
            <li key={ref.id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-800">{ref.filename}</p>
              {ref.note && <p className="text-gray-600 italic mb-2">{ref.note}</p>}

              <div className="flex gap-4 mt-2 flex-wrap">
                <a
                  href={ref.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Download
                </a>

                {ref.download_url.endsWith(".pdf") ? (
                  <button
                    onClick={() => setSelectedReferral(ref)}
                    className="text-green-600 underline"
                  >
                    View
                  </button>
                ) : (
                  <a
                    href={ref.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 underline"
                  >
                    View
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedReferral && selectedReferral.download_url.endsWith(".pdf") && (
        <PDFModal
          url={selectedReferral.download_url}
          title={selectedReferral.filename}
          onClose={() => setSelectedReferral(null)}
        />
      )}
    </div>
  );
}
