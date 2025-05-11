import React from "react";

export default function Card({ icon, title, description, onClick, background }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex items-center space-x-4 p-6 ${background || "bg-white"} shadow-md rounded-xl hover:shadow-xl transition-all`}
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
