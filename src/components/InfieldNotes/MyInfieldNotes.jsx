import React, { useEffect, useState } from "react";

export default function MyInfieldNotes() {
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchNotes = async () => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch(`${apiUrl}/infield-notes/mine`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setNotes(data);
    }
  };

  const deleteNote = async (id) => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch(`${apiUrl}/infield-notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setMessage("🗑️ Note deleted.");
      setNotes(notes.filter((n) => n.id !== id));
    } else {
      setMessage("❌ Failed to delete note.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">My Infield Notes</h2>
      {message && <p className="mb-2 text-green-600">{message}</p>}
      {notes.length === 0 && <p className="text-gray-500">No infield notes found.</p>}
      {notes.map(note => (
        <div key={note.id} className="border p-4 rounded mb-4 bg-white shadow">
          <p><strong>Case:</strong> {note.case_name} – {note.case_number}</p>
          <p><strong>Date:</strong> {note.visit_date || "N/A"}</p>
          <p><strong>Summary:</strong> {note.cleaned_summary || "No summary yet."}</p>
          <div className="flex gap-3 mt-2">
            <button className="text-blue-600 underline">Use in Visit Form</button>
            <button className="text-purple-600 underline">Use in Main Note</button>
            <button onClick={() => deleteNote(note.id)} className="text-red-600 underline">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
