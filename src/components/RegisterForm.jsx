import { useEffect, useState } from "react";

export default function RegisterForm() {
  const [agencies, setAgencies] = useState([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/agencies")
      .then(res => res.json())
      .then(setAgencies)
      .catch(err => console.error("❌ Failed to load agencies", err));
  }, []);

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

    const res = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("❌ Registration error:", data);
      alert("Registration failed: " + (data.detail || "unknown error"));
    } else {
      console.log("✅ Registered:", data);
      alert("User registered successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <input name="email" placeholder="Email" required className="input" />
      <input name="password" type="password" placeholder="Password" required className="input" />
      <input name="full_name" placeholder="Full Name" required className="input" />
      <select
        required
        value={selectedAgencyId}
        onChange={(e) => setSelectedAgencyId(e.target.value)}
        className="input"
      >
        <option value="">Select Agency</option>
        {agencies.map((agency) => (
          <option key={agency.id} value={agency.id}>
            {agency.name}
          </option>
        ))}
      </select>
      <button type="submit" className="btn">Register</button>
    </form>
  );
}
