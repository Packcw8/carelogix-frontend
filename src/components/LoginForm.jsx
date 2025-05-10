import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // Use email for both form and request payload
    const formData = new URLSearchParams();
    formData.append("email", e.target.email.value); // Use email here
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
    <form onSubmit={handleLogin} className="space-y-4 p-4 max-w-md mx-auto">
      <input name="email" placeholder="Email" required className="input" />
      <input name="password" type="password" placeholder="Password" required className="input" />
      <button type="submit" className="btn">Login</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}


