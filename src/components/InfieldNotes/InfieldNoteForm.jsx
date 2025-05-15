import React, { useEffect, useState, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

export default function InfieldNoteForm() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(() => localStorage.getItem("infield_selectedClient") || "");
  const [caseName, setCaseName] = useState(() => localStorage.getItem("infield_caseName") || "");
  const [caseNumber, setCaseNumber] = useState(() => localStorage.getItem("infield_caseNumber") || "");
  const [content, setContent] = useState(() => localStorage.getItem("infield_content") || "");
  const [visitDate, setVisitDate] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [message, setMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const [previewSummary, setPreviewSummary] = useState("");
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
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
  }, [selectedClient, caseName, caseNumber, content]);

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
    setServiceType("");
    setSelectedClient("");
    setPreviewSummary("");
    setAwaitingConfirmation(false);
    localStorage.removeItem("infield_selectedClient");
    localStorage.removeItem("infield_caseName");
    localStorage.removeItem("infield_caseNumber");
    localStorage.removeItem("infield_content");
  };

  const handleDateChange = (e) => {
    const rawValue = e.target.value;
    setVisitDate(rawValue);

    const [year, month, day] = rawValue.split("-");
    const formatted = new Date(`${year}-${month}-${day}T00:00:00`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setContent((prev) => {
      const lines = prev.split("\n").filter(Boolean);
      const updated = [formatted];
      if (serviceType) updated.push(serviceType);
      if (lines.length > 2) updated.push(...lines.slice(2));
      return updated.join("\n");
    });
  };

  const handleServiceChange = (e) => {
    setServiceType(e.target.value);
    setContent((prev) => {
      const lines = prev.split("\n");
      if (lines.length > 1) {
        lines[1] = e.target.value;
      } else {
        lines.splice(1, 0, e.target.value);
      }
      return lines.join("\n");
    });
  };

  const extractDateFromContent = (text) => {
    const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/);
    return dateMatch ? dateMatch[0] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");
    const visitDate = extractDateFromContent(content);

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

      setPreviewSummary(aiData.cleaned);
      setAwaitingConfirmation(true);
      setMessage("Preview ready. Review below and confirm save.");
    } catch (err) {
      console.error("❌ AI-enhanced submission error:", err);
      setMessage("❌ AI-enhanced submission failed.");
    }
  };

  const confirmSave = async () => {
    const token = localStorage.getItem("auth_token");
    const visitDate = extractDateFromContent(content);

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
        cleaned_summary: previewSummary,
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

        <label className="block font-medium">Visit Date</label>
        <input
          type="date"
          value={visitDate}
          onChange={handleDateChange}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <label className="block font-medium">Service Type</label>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={serviceType}
          onChange={handleServiceChange}
        >
          <option value="">Select service type</option>
          <option value="SV1">SV1</option>
          <option value="ATT">ATT</option>
          <option value="Transport">Transport</option>
          <option value="Skill Building">Skill Building</option>
          <option value="Class">Class</option>
        </select>

        <label className="block font-medium">Infield Notes</label>
        <textarea
          placeholder="Press Enter after each line for a new note"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded h-40"
          required
        />

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2 rounded-full ${recording ? "bg-red-500" : "bg-gray-500"}`}
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
            🧠 Clean with AI & Preview
          </button>
        </div>
      </form>

      {awaitingConfirmation && (
        <div className="mt-6 p-4 border border-blue-300 rounded bg-blue-50">
          <h3 className="font-bold text-lg mb-2">🧠 Preview (Cleaned Summary)</h3>
          <p className="whitespace-pre-wrap text-gray-800">{previewSummary}</p>
          <button
            onClick={confirmSave}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ✅ Confirm Save
          </button>
        </div>
      )}
    </div>
  );
}