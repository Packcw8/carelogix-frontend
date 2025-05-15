import React, { useEffect, useState, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

export default function InfieldNoteForm() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(() => localStorage.getItem("infield_selectedClient") || "");
  const [caseName, setCaseName] = useState(() => localStorage.getItem("infield_caseName") || "");
  const [caseNumber, setCaseNumber] = useState(() => localStorage.getItem("infield_caseNumber") || "");
  const [content, setContent] = useState(() => localStorage.getItem("infield_content") || "");
  const [visitDate, setVisitDate] = useState(() => localStorage.getItem("infield_visitDate") || "");
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

  useEffect(() => {
    localStorage.setItem("infield_selectedClient", selectedClient);
    localStorage.setItem("infield_caseName", caseName);
    localStorage.setItem("infield_caseNumber", caseNumber);
    localStorage.setItem("infield_content", content);
    localStorage.setItem("infield_visitDate", visitDate);
  }, [selectedClient, caseName, caseNumber, content, visitDate]);

  const handleClientSelect = (id) => {
    const client = clients.find((c) => c.id === id);
    if (client) {
      setSelectedClient(id);
      setCaseName(client.case_name);
      setCaseNumber(client.case_number);
    }
  };

  const clearForm = () => {
    setCaseName("");
    setCaseNumber("");
    setContent("");
    setVisitDate("");
    setSelectedClient("");
    localStorage.removeItem("infield_selectedClient");
    localStorage.removeItem("infield_caseName");
    localStorage.removeItem("infield_caseNumber");
    localStorage.removeItem("infield_content");
    localStorage.removeItem("infield_visitDate");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");

    try {
      const saveRes = await fetch(`${apiUrl}/infield-notes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          case_name: caseName,
          case_number: caseNumber,
          content,
          visit_date: visitDate || null,
        }),
      });

      if (saveRes.ok) {
        setMessage("✅ Note saved successfully.");
        clearForm();
      } else {
        const error = await saveRes.json();
        setMessage(error.detail || "❌ Saving note failed.");
      }
    } catch (err) {
      console.error("❌ Note submission error:", err);
      setMessage("❌ Submission failed.");
    }
  };

  const handleAIEnhancedSubmit = async () => {
    const token = localStorage.getItem("auth_token");

    try {
      const aiRes = await fetch(`${apiUrl}/ai/clean-note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!aiRes.ok) throw new Error("AI cleanup failed.");
      const aiData = await aiRes.json();

      setVisitDate(aiData.date !== "unknown" ? aiData.date : "");

      const saveRes = await fetch(`${apiUrl}/infield-notes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          case_name: caseName,
          case_number: caseNumber,
          content,
          cleaned_summary: aiData.cleaned,
          visit_date: aiData.date !== "unknown" ? aiData.date : null,
        }),
      });

      if (saveRes.ok) {
        setMessage("✅ AI-enhanced note submitted successfully.");
        clearForm();
      } else {
        const error = await saveRes.json();
        setMessage(error.detail || "❌ Saving note failed.");
      }
    } catch (err) {
      console.error("❌ AI-enhanced submission error:", err);
      setMessage("❌ AI-enhanced submission failed.");
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

        <div>
          <label className="block font-medium">Visit Date</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
          />
        </div>

        <label className="block font-medium">Infield Notes</label>
        <textarea
          placeholder="Write or dictate your infield note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded h-40"
          required
        />

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2 rounded-full ${
              recording ? "bg-red-500" : "bg-gray-500"
            }`}
            title={recording ? "Stop Recording" : "Start Recording"}
          >
            {recording ? (
              <MicOff className="text-white w-5 h-5" />
            ) : (
              <Mic className="text-white w-5 h-5" />
            )}
          </button>

          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            💾 Save Raw Note
          </button>

          <button
            type="button"
            onClick={handleAIEnhancedSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🧠 Clean with AI & Save
          </button>
        </div>
      </form>
    </div>
  );
}
