// components/Layout.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileNavIcon from "./MobileNavIcon";

export default function Layout({ children, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const agency = user?.agency?.name || "CareLogix";

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Forms", path: "/myforms" },
    { label: "Referrals", path: "/referrals" },
    { label: "Invoices", path: "/invoice" },
    { label: "Clients", path: "/clients" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row relative">
      {/* Fixed Top-right Logout Button */}
      <button
        onClick={() => navigate("/logout")}
        className="fixed top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-50"
        title="Log out"
      >
        ⎋
      </button>

      {/* Sidebar for desktop */}
      <aside className="hidden md:block w-64 bg-white shadow-lg p-6">
        <h1 className="text-2xl font-bold text-orange-500 mb-6">{agency}</h1>
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`block w-full text-left p-2 rounded hover:bg-gray-100 ${
                location.pathname === item.path
                  ? "text-orange-500 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 pb-24 md:p-10">{children}</main>

      {/* Bottom nav for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around p-2 z-40">
        <MobileNavIcon label="Dashboard" icon="🏠" to="/dashboard" />
        <MobileNavIcon label="Forms" icon="📝" to="/myforms" />
        <MobileNavIcon label="Referrals" icon="➡️" to="/referrals" />
        <MobileNavIcon label="Invoices" icon="💵" to="/invoice" />
      </nav>
    </div>
  );
}
