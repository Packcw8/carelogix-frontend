import React, { useEffect, useState, useRef } from "react";
import { Mic, MicOff, Sparkles } from "lucide-react";

export default function InfieldNoteForm() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [caseName, setCaseName] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${apiUrl}/clients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    };
    fetchClients();
  }, []);

  const handleClientSelect = (id) => {
    const client = clients.find((c) => c.id === id);
    if (client) {
      setSelectedClient(id);
      setCaseName(client.case_name);
      setCaseNumber(client.case_number);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");

    const res = await fetch(`${apiUrl}/infield-notes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        case_name: caseName,
        case_number: caseNumber,
        content,
      }),
    });

    if (res.ok) {
      setMessage("✅ Note submitted successfully.");
      setCaseName("");
      setCaseNumber("");
      setContent("");
      setSelectedClient("");
    } else {
      const error = await res.json();
      setMessage(error.detail || "❌ Submission failed.");
    }
  };

  const handleCleanWithAI = async () => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch(`${apiUrl}/ai/clean-note`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      const data = await res.json();
      setContent(data.cleaned);
      setMessage("🧠 Note cleaned with AI.");
    } else {
      setMessage("⚠️ AI cleanup failed.");
    }
  };

  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setRecording(true);
    recognition.onend = () => setRecording(false);
    recognition.onerror = () => setRecording(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setContent((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceInput = () => {
    recognitionRef.current?.stop();
  };

  const toggleRecording = () => {
    recording ? stopVoiceInput() : startVoiceInput();
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">New Infield Note</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedClient}
          onChange={(e) => handleClientSelect(e.target.value)}
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.case_name} – {client.case_number}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Case Name"
          value={caseName}
          onChange={(e) => setCaseName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          placeholder="Case Number"
          value={caseNumber}
          onChange={(e) => setCaseNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <div className="relative">
          <textarea
            placeholder="Write or dictate your infield note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded h-40"
            required
          />
          {/* 🎙️ Voice Button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              recording ? "bg-red-500" : "bg-gray-500"
            }`}
            title={recording ? "Stop Recording" : "Start Recording"}
          >
            {recording ? <MicOff className="text-white w-5 h-5" /> : <Mic className="text-white w-5 h-5" />}
          </button>

          {/* ✨ AI Clean Button */}
          <button
            type="button"
            onClick={handleCleanWithAI}
            className="absolute top-2 right-12 p-2 rounded-full bg-purple-600 hover:bg-purple-700"
            title="Clean with GPT"
          >
            <Sparkles className="text-white w-5 h-5" />
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Note
        </button>
      </form>
    </div>
  );
}
