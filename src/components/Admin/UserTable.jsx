import React, { useEffect, useState } from "react";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [userForms, setUserForms] = useState({});

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

  const toggleForms = async (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }

    if (!userForms[userId]) {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${apiUrl}/admin/users/${userId}/forms`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUserForms((prev) => ({ ...prev, [userId]: data }));
      } else {
        console.error("Failed to fetch forms for user", userId);
      }
    }

    setExpandedUserId(userId);
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
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <tr
                  onClick={() => toggleForms(user.id)}
                  className="cursor-pointer hover:bg-gray-50 transition-all border-t border-gray-200 text-sm"
                >
                  <td className="px-4 py-3">{user.full_name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.agency_name || "—"}</td>
                </tr>
                {expandedUserId === user.id && (
                  <tr>
                    <td colSpan={3} className="bg-gray-50 px-4 py-3">
                      {userForms[user.id]?.length > 0 ? (
                        <ul className="space-y-2">
                          {userForms[user.id].map((form) => (
                            <li key={form.id} className="border rounded p-3 bg-white shadow">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <p><strong>Case:</strong> {form.case_name}</p>
                                <p><strong>Case #:</strong> {form.case_number}</p>
                                <p><strong>Type:</strong> {form.form_type}</p>
                                <p><strong>Date:</strong> {form.service_date || form.created_at?.split("T")[0]}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No forms submitted.</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
