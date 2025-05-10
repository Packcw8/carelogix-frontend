import React from "react";

export default function Layout({ title = "CareLogix", children }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow px-4 py-3 sticky top-0 z-50">
        <h1 className="text-xl font-semibold text-blue-600">{title}</h1>
      </header>

      {/* Content */}
      <main className="p-4 max-w-3xl mx-auto w-full">{children}</main>
    </div>
  );
}
