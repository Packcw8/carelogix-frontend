import React, { useEffect, useState } from "react";

export default function ClientManager({ onReturn }) {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    case_name: "",
    case_number: "",
    client_number: "",
  });

  const token = localStorage.getItem("auth_token");
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const fetchClients = async () => {
    const res = await fetch(`${apiUrl}/clients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setClients(data);
    } else {
      alert("Failed to load clients");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAdd = async () => {
    const params = new URLSearchParams(newClient).toString();
    const res = await fetch(`${apiUrl}/clients?${params}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setNewClient({ case_name: "", case_number: "", client_number: "" });
      fetchClients();
    } else {
      alert("Failed to add client");
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${apiUrl}/clients/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      fetchClients();
    } else {
      alert("Failed to delete client");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={onReturn}
        className="mb-6 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-4 text-center">Manage Clients</h2>

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        {["case_name", "case_number", "client_number"].map((field) => (
          <input
            key={field}
            name={field}
            value={newClient[field]}
            placeholder={field.replace("_", " ")}
            onChange={(e) =>
              setNewClient({ ...newClient, [field]: e.target.value })
            }
            className="border px-3 py-2 rounded"
          />
        ))}
      </div>

      <button
        onClick={handleAdd}
        className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        ➕ Add Client
      </button>

      <table className="w-full border border-gray-300 text-sm bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Case Name</th>
            <th className="p-2 border">Case #</th>
            <th className="p-2 border">Client #</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="even:bg-gray-50">
              <td className="p-2 border">{client.case_name}</td>
              <td className="p-2 border">{client.case_number}</td>
              <td className="p-2 border">{client.client_number}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDelete(client.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
