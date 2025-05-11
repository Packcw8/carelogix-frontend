import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MobileNavIcon({ label, icon, to }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <button
      onClick={() => navigate(to)}
      className={`flex flex-col items-center text-xs px-2 py-1 rounded transition-colors ${
        isActive ? "text-orange-500 font-bold" : "text-gray-600 hover:text-gray-800"
      }`}
    >
      <span className="text-xl mb-1">{icon}</span>
      {label}
    </button>
  );
}
