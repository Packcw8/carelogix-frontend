import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => {
        if (!data.is_admin) {
          navigate("/dashboard"); // redirect non-admin users
        } else {
          setUser(data);
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  if (!user) {
    return <div className="text-center mt-20 text-gray-600">Loading admin panel...</div>;
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl border border-gray-200">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Welcome Admin, {user.full_name}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          This is your administrative dashboard.
        </p>
        {/* Next: User List goes here */}
      </div>
    </Layout>
  );
}
