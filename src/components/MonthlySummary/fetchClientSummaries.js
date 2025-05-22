export async function fetchClientSummaries(case_name, service_month) {
  if (!case_name || !service_month) {
    throw new Error("Missing case name or service month");
  }

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("auth_token");

  try {
    const response = await fetch(
      `${apiUrl}/summaries/${encodeURIComponent(case_name)}/${service_month}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("❌ Error fetching client summaries:", err.message);
    throw err;
  }
}
