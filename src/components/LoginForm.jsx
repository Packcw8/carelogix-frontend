import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onLogin }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;
  if (!apiUrl) {
    console.error("❌ REACT_APP_API_URL is not defined. Check your .env and Vercel settings.");
    throw new Error("REACT_APP_API_URL is missing.");
  }
  console.log("🔐 Using API for login:", apiUrl);

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", e.target.email.value);
    formData.append("password", e.target.password.value);

    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
        body: formData.toString(),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("auth_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Store full user object
        if (onLogin) onLogin();
        navigate("/dashboard");
      } else {
        console.error("Login error response:", data);
        setError(data.detail || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Failed to connect to the server.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      <input
        name="email"
        placeholder="Email"
        required
        className="w-full px-4 py-2 border rounded"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="w-full px-4 py-2 border rounded"
      />
      <button
        type="submit"
        className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
      >
        Login
      </button>

      {error && <p className="text-red-500">{error}</p>}

      <p className="mt-4 text-sm text-center">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="text-blue-600 underline"
        >
          Register here
        </button>
      </p>
    </form>
  );
}

