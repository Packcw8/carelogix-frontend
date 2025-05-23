import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Card";

export default function Dashboard({ onLogout, user }) {
  const navigate = useNavigate();
  const agencyName = user?.agency?.name || "CareLogix";

  return (
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
          icon="📅"
          title="Monthly Summary"
          description="Compile a monthly visit report"
          onClick={() => navigate("/form/monthly_summary")}
          background="bg-indigo-100"
        />
        <Card
          icon="📓"
          title="Infield Note"
          description="Write a field observation"
          onClick={() => navigate("/infield-note/new")}
          background="bg-emerald-100"
        />
        <Card
          icon="🗃️"
          title="My Infield Notes"
          description="Review and reuse field notes"
          onClick={() => navigate("/infield-notes/mine")}
          background="bg-orange-100"
        />
        <Card
          icon="📂"
          title="My Forms"
          description="View past submissions"
          onClick={() => navigate("/myforms")}
        />
        <Card
          icon="📊"
          title="Current Invoice"
          description="Edit this week's hours + mileage"
          onClick={() => navigate("/invoice")}
          background="bg-purple-100"
        />
        <Card
          icon="💵"
          title="My Invoices"
          description="View saved invoices"
          onClick={() => navigate("/invoices")}
          background="bg-green-100"
        />
        <Card
          icon="👤"
          title="Manage Clients"
          description="Add or remove clients"
          onClick={() => navigate("/clients")}
          background="bg-blue-100"
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
  );
}
