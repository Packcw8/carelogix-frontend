// src/utils/downloadDoc.js

export default async function downloadDoc(formData) {
  try {
    const response = await fetch("http://127.0.0.1:8000/generate-doc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: JSON.stringify({
        template_name: "supervised_visit.docx",
        context: formData,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert("❌ Error: " + errorText);
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "SupervisedVisit.docx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("❌ Download error:", error);
    alert("Failed to generate document.");
  }
}
