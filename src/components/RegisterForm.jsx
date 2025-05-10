import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [agencies, setAgencies] = useState([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(`${apiUrl}/agencies`)
      .then(res => res.json())
      .then(setAgencies)
      .catch(err => {
        console.error("❌ Failed to load agencies", err);
        setError("Failed to load agencies. Please try again later.");
      });
  }, [apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: e.target.email.value,
      password: e.target.password.value,
      full_name: e.target.full_name.value,
      agency_id: selectedAgencyId,
    };

    if (!payload.agency_id) {
      alert("Please select an agency");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Registration error:", data);
        alert("Registration failed: " + (data.detail || "unknown error"));
      } else {
        console.log("✅ Registered:", data);
        alert("User registered successfully! Redirecting to login...");
        navigate("/login");
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Register</h2>
      {error && <p className="text-red-500">{error}</p>}

      <input name="email" placeholder="Email" required className="w-full px-4 py-2 border rounded" />
      <input name="password" type="password" placeholder="Password" required className="w-full px-4 py-2 border rounded" />
      <input name="full_name" placeholder="Full Name" required className="w-full px-4 py-2 border rounded" />

      <select
        required
        value={selectedAgencyId}
        onChange={(e) => setSelectedAgencyId(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      >
        <option value="">Select Agency</option>
        {agencies.map((agency) => (
          <option key={agency.id} value={agency.id}>
            {agency.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
      >
        Register
      </button>
    </form>
  );
}


