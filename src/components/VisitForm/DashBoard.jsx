import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const agencyName = user?.agency?.name || "CareLogix";

  return (
    title={`${agencyName} Dashboard`}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Welcome to CareLogix
        </h2>
        <p className="text-center text-gray-500 mb-6">
          What would you like to do?
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/form/visit")}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition-all"
          >
            🧾 Start Supervised Visit Form
          </button>

          <button
            onClick={() => navigate("/form/main_note")}
            className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition-all"
          >
            📝 Start Main Note Form
          </button>

          <button
            onClick={() => navigate("/myforms")}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition-all"
          >
            📂 View My Forms
          </button>

          <button
            onClick={onLogout}
            className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition-all"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </Layout>
  );
}

