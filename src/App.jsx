// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Landing from "./pages/land";
import Login from "./pages/Login";
import Receptionist from "./pages/Receptionist";
import Doctor from "./pages/Doctor";

// Optional placeholder for register page
function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <p className="text-gray-600">Registration form coming soon 🚀</p>
      </div>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState(null);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleLogout = () => {
    setRole(null);
  };

  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Landing />} />

      {/* Login Page */}
      <Route
        path="/login"
        element={<Login onRoleSelect={handleRoleSelect} />}
      />

      {/* Register Page */}
      <Route path="/register" element={<Register />} />

      {/* Role-based dashboards */}
      <Route
        path="/receptionist"
        element={
          role === "receptionist" ? (
            <div className="min-h-screen bg-gray-50">
              <nav className="flex justify-between items-center bg-indigo-600 text-white px-6 py-3 shadow-md">
                <h1 className="text-lg font-semibold">Direction</h1>
                <div className="flex items-center gap-4">
                  <span className="capitalize">{role}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-indigo-600 px-3 py-1 rounded-lg hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </nav>
              <main className="p-4">
                <Receptionist />
              </main>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/doctor"
        element={
          role === "doctor" ? (
            <div className="min-h-screen bg-gray-50">
              <nav className="flex justify-between items-center bg-indigo-600 text-white px-6 py-3 shadow-md">
                <h1 className="text-lg font-semibold">Direction</h1>
                <div className="flex items-center gap-4">
                  <span className="capitalize">{role}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-indigo-600 px-3 py-1 rounded-lg hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </nav>
              <main className="p-4">
                <Doctor />
              </main>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Fallback → landing */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
