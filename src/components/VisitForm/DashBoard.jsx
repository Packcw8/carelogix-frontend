import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import Card from "../Card";

export default function Dashboard({ onLogout, user }) {
  const navigate = useNavigate();
  const agencyName = user?.agency?.name || "CareLogix";

  return (
    <Layout user={user}>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Welcome to {agencyName}
        </h2>

        <p className="text-center text-gray-500 mb-10 text-sm sm:text-base">
          What would you like to do?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card
            icon="🧾"
            title="Supervised Visit"
            description="Start visit form"
            onClick={() => navigate("/form/visit")}
          />
          <Card
            icon="📝"
            title="Main Note"
            description="Start main note"
            onClick={() => navigate("/form/main_note")}
          />
          <Card
            icon="📂"
            title="My Forms"
            description="View past submissions"
            onClick={() => navigate("/myforms")}
          />
          <Card
            icon="💵"
            title="Invoices"
            description="View weekly billing summary"
            onClick={() => navigate("/invoice")}
            background="bg-green-100"
          />
          {user?.is_admin && (
            <Card
              icon="🛠️"
              title="Admin Panel"
              description="Manage users and referrals"
              onClick={() => navigate("/admin")}
              background="bg-yellow-100"
            />
          )}
          <Card
            icon="🚪"
            title="Logout"
            description="Sign out of your account"
            onClick={onLogout}
            background="bg-gray-100"
          />
        </div>
      </div>
    </Layout>
  );
}
