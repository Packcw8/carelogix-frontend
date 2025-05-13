import React from "react";
import UserTable from "./UserTable";

export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow border border-gray-200">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Admin Dashboard</h2>
      <UserTable />
    </div>
  );
}
