import React, { useState, useRef } from "react";

export default function InfieldNoteForm() {
  const [caseName, setCaseName] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);

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
        content: content,
      }),
    });

    if (response.ok) {
      setMessage("✅ Note submitted successfully.");
      setCaseName("");
      setCaseNumber("");
      setContent("");
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
            className={`absolute top-2 right-2 p-2 text-white rounded-full ${
              recording ? "bg-red-500" : "bg-gray-500"
            }`}
            title={recording ? "Stop Recording" : "Start Recording"}
          >
            🎙️
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
