import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => {
        if (!data.is_admin) {
          navigate("/dashboard");
        } else {
          setUser(data);
          fetch(`${process.env.REACT_APP_API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then(setUsers)
            .catch(console.error);
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  if (!user) return <div className="text-center mt-20 text-gray-600">Loading admin panel...</div>;

  return (
    <Layout title="Admin Dashboard">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow border border-gray-200">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Admin Dashboard</h2>

        <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Agency</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{u.full_name}</td>
                <td className="border border-gray-300 px-4 py-2">{u.email}</td>
                <td className="border border-gray-300 px-4 py-2">{u.agency_name || "—"}</td>
                <td className="border border-gray-300 px-4 py-2">{u.is_admin ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

