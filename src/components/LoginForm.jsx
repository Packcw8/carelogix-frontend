import { useState, useEffect } from "react";

export default function LoginForm({ onLogin }) {
  const [error, setError] = useState("");
  const [agencies, setAgencies] = useState([]);

  // Fetch agencies data when the component mounts
  useEffect(() => {
    fetch("http://127.0.0.1:8000/agencies")
      .then(res => res.json())
      .then(setAgencies)
      .catch(err => console.error("❌ Failed to load agencies", err));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", e.target.email.value);  // Pass email as username for OAuth2PasswordRequestForm
    formData.append("password", e.target.password.value);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        onLogin();
      } else {
        setError("Login failed");
      }
    } catch (err) {
      setError("Error connecting to server.");
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin} className="space-y-4 p-4 max-w-md mx-auto">
        <input name="email" placeholder="Email" required className="input" />
        <input name="password" type="password" placeholder="Password" required className="input" />
        <button type="submit" className="btn">Login</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>

      <div className="mt-4">
        <h3>Agencies:</h3>
        {agencies.length === 0 ? (
          <p>No agencies found.</p>
        ) : (
          <ul>
            {agencies.map((agency, index) => (
              <li key={index}>{agency.name}</li>  // Assuming each agency has a 'name' property
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


