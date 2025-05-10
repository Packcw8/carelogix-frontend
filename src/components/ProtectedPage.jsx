import { useEffect, useState } from "react";

export default function ProtectedPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/me", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(setUser)
      .catch(err => console.error("Access denied", err));
  }, []);

  if (!user) return <p>Loading or not authorized...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Welcome, {user.full_name}</h2>
      <p>Agency: {user.agency_id}</p>
    </div>
  );
}
