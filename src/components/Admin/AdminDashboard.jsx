import React from "react";
import Layout from "../Layout";
import UserTable from "./UserTable"; // ✅ This links the table you control

export default function AdminDashboard() {
  return (
    <Layout title="Admin Dashboard">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow border border-gray-200">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Admin Dashboard</h2>
        <UserTable />
      </div>
    </Layout>
  );
}

