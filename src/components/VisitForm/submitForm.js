export async function submitForm({ formData, segments, templateName, formType }) {
  const formattedDate = new Date(formData.service_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const context = {
    ...formData,
    service_date: formattedDate,
    code: formData.code.join(", "),
  };

  // Calculate session units
  if (formData.start_time && formData.stop_time) {
    const sTime = new Date(`1970-01-01T${formData.start_time}`);
    const eTime = new Date(`1970-01-01T${formData.stop_time}`);
    const durationUnits = Math.max(0, Math.round((eTime - sTime) / 1000 / 60 / 15));
    context["units"] = durationUnits.toString();
  }

  // Travel Segment handling
  let totalTT = 0;
  let totalITT = 0;

  segments.forEach((seg, i) => {
    const idx = (i * 2) + 1;
    context[`location_${idx}`] = seg.from;
    context[`location_${idx + 1}`] = seg.to;
    context[`tt_starttime${idx}`] = seg.at_start_time;
    context[`tt_starttime${idx + 1}`] = seg.at_stop_time;
    context[`itt_starttime${idx}`] = seg.itt_start_time;
    context[`itt_starttime${idx + 1}`] = seg.itt_stop_time;

    const calcUnits = (start, stop) => {
      if (!start || !stop) return 0;
      const s = new Date(`1970-01-01T${start}`);
      const e = new Date(`1970-01-01T${stop}`);
      return Math.max(0, Math.round((e - s) / 1000 / 60 / 15));
    };

    totalTT += calcUnits(seg.at_start_time, seg.at_stop_time);
    totalITT += calcUnits(seg.itt_start_time, seg.itt_stop_time);
  });

  context["tt_units"] = totalTT.toString();
  context["itt_units"] = totalITT.toString();
  context["miles"] = formData.miles || "0";

  // Submit to backend
  const apiUrl = process.env.REACT_APP_API_URL;
  if (!apiUrl) {
    console.error("❌ REACT_APP_API_URL is not defined. Check your .env and Vercel settings.");
    throw new Error("REACT_APP_API_URL is missing.");
  }
  console.log("🔗 Submitting to backend:", apiUrl);

  const token = localStorage.getItem("auth_token");

  const res = await fetch(`${apiUrl}/generate-doc`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      template_name: templateName,
      form_type: formType,
      context,
    }),
  });

  if (!res.ok) {
    alert("❌ Error generating document.");
    return;
  }

  const data = await res.json();

  if (data.download_url) {
    window.open(data.download_url, "_blank");
  } else {
    alert("❌ Document created, but download URL missing.");
    console.error(data);
  }
}
