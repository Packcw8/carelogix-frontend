export async function submitMonthlySummary({ formData }) {
  // Validate required fields
  if (!formData.service_month) {
    alert("❌ Service month is required.");
    throw new Error("Missing service_month in formData.");
  }

  const formattedDate = new Date(`${formData.service_month}-01T12:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const context = {
    ...formData,
    service_date: formattedDate,
    code: "",
    units: "0",
    tt_units: "0",
    itt_units: "0",
    miles: formData.mileage || "0",
  };

  const apiUrl = process.env.REACT_APP_API_URL;
  if (!apiUrl) {
    console.error("❌ REACT_APP_API_URL is not defined.");
    throw new Error("REACT_APP_API_URL is missing.");
  }

  const token = localStorage.getItem("auth_token");
  const res = await fetch(`${apiUrl}/generate-doc`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      template_name: "monthlysummary.docx",
      form_type: "Monthly Summary",
      context,
    }),
  });

  if (!res.ok) {
    alert("❌ Error generating document.");
    return;
  }

  const data = await res.json();
  if (data.download_url_docx) {
    window.open(data.download_url_docx, "_blank");
  } else {
    alert("❌ Document created, but download URL missing.");
    console.error("Missing download_url_docx:", data);
  }
}
