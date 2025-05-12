import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${apiUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const handleMenuClick = (userId) => {
    setMenuOpenId(menuOpenId === userId ? null : userId);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">All Users</h2>
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 rounded-xl">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left text-sm">
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Agency</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <tr className="hover:bg-gray-50 border-t border-gray-200 text-sm">
                  <td className="px-4 py-3">{user.full_name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.agency_name || "—"}</td>
                  <td className="px-4 py-3 text-right relative">
                    <button
                      onClick={() => handleMenuClick(user.id)}
                      className="text-blue-600 hover:underline"
                    >
                      ▼ Options
                    </button>
                    {menuOpenId === user.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
                        <button
                          onClick={() => navigate(`/admin/user/${user.id}`)}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          View User's Notes
                        </button>
                        <button
                          disabled
                          className="block w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                        >
                          View User's Invoice (coming soon)
                        </button>
                        <button
                          disabled
                          className="block w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                        >
                          Assign Tier (coming soon)
                        </button>
                        <button
                          disabled
                          className="block w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                        >
                          Assign Referral (coming soon)
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
