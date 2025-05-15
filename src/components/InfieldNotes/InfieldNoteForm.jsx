import React, { useEffect, useState, useRef } from "react";
import { Mic, MicOff } from "lucide-react"; // ⬅️ modern icons if using lucide

export default function InfieldNoteForm() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [caseName, setCaseName] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/clients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    };

    fetchClients();
  }, []);

  const handleClientSelect = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setSelectedClient(clientId);
      setCaseName(client.case_name);
      setCaseNumber(client.case_number);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${process.env.REACT_APP_API_URL}/infield-notes/`, {
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

    if (response.ok) {
      setMessage("✅ Note submitted successfully.");
      setCaseName("");
      setCaseNumber("");
      setContent("");
      setSelectedClient("");
    } else {
      const error = await response.json();
      setMessage(error.detail || "❌ Something went wrong.");
    }
  };

  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setRecording(true);
    recognition.onend = () => setRecording(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setContent((prev) => prev + " " + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceInput = () => {
    recognitionRef.current?.stop();
  };

  const toggleRecording = () => {
    if (recording) {
      stopVoiceInput();
    } else {
      startVoiceInput();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">New Infield Note</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Dropdown */}
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
          <button
            type="button"
            onClick={toggleRecording}
            className="absolute top-2 right-2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition"
            title={recording ? "Stop Recording" : "Start Recording"}
          >
            {recording ? <MicOff className="text-white w-5 h-5" /> : <Mic className="text-white w-5 h-5" />}
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
