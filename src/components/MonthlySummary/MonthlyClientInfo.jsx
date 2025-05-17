import React, { useEffect } from "react";

export default function MonthlyClientInfo({ formData, setFormData, clients, onNext }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClientSelect = (e) => {
    const selectedId = e.target.value;
    const selected = clients.find((c) => c.id === selectedId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        case_name: selected.case_name,
        case_number: selected.case_number,
        client_number: selected.client_number,
        caseworker_name: selected.caseworker_name || "",
        caseworker_email: selected.worker_email || "",
      }));
    }
  };

  useEffect(() => {
    if (!formData.service_month) {
      const currentMonth = new Date().toISOString().slice(0, 7);
      setFormData((prev) => ({ ...prev, service_month: currentMonth }));
    }
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold">Step 1: Client Information</h2>

      <div>
        <label className="block font-medium">Select Client</label>
        <select
          name="client_select"
          className="w-full border rounded px-3 py-2"
          onChange={handleClientSelect}
          defaultValue=""
        >
          <option value="" disabled>
            -- Choose a client --
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.case_name} ({client.case_number})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Caseworker Name</label>
        <input
          type="text"
          name="caseworker_name"
          value={formData.caseworker_name || ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium">Caseworker Email</label>
        <input
          type="email"
          name="caseworker_email"
          value={formData.caseworker_email || ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium">Service Month</label>
        <input
          type="month"
          name="service_month"
          value={formData.service_month || ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Continue
      </button>
    </form>
  );
}
