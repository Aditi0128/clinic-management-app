// src/pages/Login.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login({ onRoleSelect }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("receptionist");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      onRoleSelect(role);

      if (role === "receptionist") navigate("/receptionist");
      else navigate("/doctor");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 relative">
      {/* Go Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 px-4 py-2 bg-white-200 rounded hover:bg-gray-300"
      >
        ← Go Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-gray-500 text-center mb-6">
          {isRegister
            ? "Sign up to get started"
            : "Login to continue managing patients"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Role select */}
          <div className="flex justify-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="receptionist"
                checked={role === "receptionist"}
                onChange={(e) => setRole(e.target.value)}
              />
              Receptionist
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="doctor"
                checked={role === "doctor"}
                onChange={(e) => setRole(e.target.value)}
              />
              Doctor
            </label>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500 text-center">
          {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
