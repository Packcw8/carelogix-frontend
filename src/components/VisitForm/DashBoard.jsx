import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout"; // ✅ make sure this path is correct

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();

  return (
    <Layout title="CareLogix Dashboard">
      <h2 className="text-2xl font-bold mb-2">Welcome</h2>
      <p className="text-gray-600 mb-6">What would you like to do?</p>

      <div className="space-y-4">
        <button
          onClick={() => navigate("/form/visit")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          Start Supervised Visit Form
        </button>

        <button
          onClick={() => navigate("/form/main_note")}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
        >
          Start Main Note Form
        </button>

        <button
          onClick={() => navigate("/myforms")}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded"
        >
          View My Forms
        </button>

        <button
          onClick={onLogout}
          className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </Layout>
  );
}

