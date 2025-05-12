import { useEffect, useState } from "react";

export default function ProtectedPage() {
  const [user, setUser] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;
  if (!apiUrl) {
    console.error("❌ REACT_APP_API_URL is not defined. Check your .env and Vercel settings.");
    throw new Error("REACT_APP_API_URL is missing.");
  }
  console.log("🔒 Fetching user from:", apiUrl);
  console.log("✅ Active API:", apiUrl);


  useEffect(() => {
    fetch(`${apiUrl}/me`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth_token"),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then(setUser)
      .catch((err) => {
        console.error("Access denied", err);
        setUser(null);
      });
  }, [apiUrl]);

  if (!user) return <p>Loading or not authorized...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Welcome, {user.full_name}</h2>
      <p>Agency: {user.agency_id}</p>
    </div>
  );
}
