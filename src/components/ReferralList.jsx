import React, { useEffect, useState } from "react";

export default function ReferralList() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">My Referrals</h2>
      {referrals.length === 0 ? (
        <p className="text-center text-gray-600">No referrals found.</p>
      ) : (
        <ul className="space-y-4">
          {referrals.map((ref) => (
            <li key={ref.id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
              <p className="font-semibold text-gray-800">{ref.filename}</p>
              {ref.note && <p className="text-gray-600 italic mb-2">{ref.note}</p>}
              <a
                href={ref.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium hover:underline"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
