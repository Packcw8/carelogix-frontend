// utils/dynamicFormTemplateUtils.js

/**
 * Formats an ISO date to 'YYYY-MM-DD' for use in <input type="date">.
 */
export function formatLocalDate(dateString) {
  if (typeof dateString === "string" && dateString.includes("T")) {
    return dateString.split("T")[0];
  }
  return dateString || "";
}

/**
 * Returns a blank base structure for any dynamic form template.
 */
export function getBaseFormData() {
  return {
    case_name: "",
    case_number: "",
    client_number: "",
    service_date: "",
    start_time: "",
    stop_time: "",
    location: "",
    service_provided: "",
    provider: "",
    participants: "",
    summary: "",
    clients_progress: "",
    safety_checkbox: "",
    location_checkbox: "",
    abuse_checkbox: "",
    miles: "",
    code: [],
    signature: "",
  };
}

/**
 * Merges a passed note, an admin template, and user edits into one formData object.
 * Priority: user input (prev) > passed note > admin template > default blank.
 */
export function mergeDynamicTemplate({ prev = {}, passedNote = {}, adminTemplate = {} }) {
  const base = getBaseFormData();

  return {
    ...base,
    ...adminTemplate,
    ...passedNote,
    ...prev,
    service_date:
      prev.service_date && prev.service_date !== ""
        ? prev.service_date
        : formatLocalDate(passedNote.visit_date || adminTemplate.service_date),
  };
}
