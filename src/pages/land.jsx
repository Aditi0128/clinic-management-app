// src/pages/Landing.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 relative">
      {/* Animated Clinic Icon */}
      <img
        src="/clinic.gif" 
        alt="Clinic Icon"
        className="absolute left-16 w-16 h-16 opacity-100"
      />

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white relative z-10">
        <div className="flex items-center gap-2">
          <img
            src="/medical-cross.gif"
            alt="Clinic Icon"
            className="w-10 h-10" 
          />
          <h1 className="text-2xl font-bold text-gray-800">Direction</h1>
        </div>
       
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/login?mode=register")}
            className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 relative z-10">
        <div className="flex items-center gap-4">
          <img
            src="/clinic.gif" 
            alt="Clinic Icon"
            className="w-20 h-20"
          />
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-800"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Simplify Your Clinic Workflow
          </motion.h2>
        </div>

        <motion.p
          className="text-lg text-gray-600 max-w-2xl mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Direction helps doctors and receptionists streamline patient
          management, from queue handling to consultation tracking — all in one
          easy-to-use platform.
        </motion.p>

        <motion.button
          onClick={() => navigate("/login")}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 shadow-lg mt-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </section>

      {/* Features */}
      <section className="px-8 py-16 bg-white relative z-10">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Key Features
        </h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <motion.div
            className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition"
            whileHover={{ y: -5 }}
          >
            <h4 className="text-xl font-bold mb-3 text-blue-600">
              Patient Queue
            </h4>
            <p className="text-gray-600">
              Manage patient queues efficiently with real-time updates and
              automated token generation.
            </p>
          </motion.div>
          <motion.div
            className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition"
            whileHover={{ y: -5 }}
          >
            <h4 className="text-xl font-bold mb-3 text-blue-600">
              Doctor Dashboard
            </h4>
            <p className="text-gray-600">
              Organized consultation view with patient history, prescriptions,
              and billing in one place.
            </p>
          </motion.div>
          <motion.div
            className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition"
            whileHover={{ y: -5 }}
          >
            <h4 className="text-xl font-bold mb-3 text-blue-600">
              Secure & Cloud-Based
            </h4>
            <p className="text-gray-600">
              Backed by Firebase authentication and Firestore database for
              reliable and secure data storage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-6 text-gray-600 mt-12 relative z-10">
        © {new Date().getFullYear()} Direction. All rights reserved.
      </footer>
    </div>
  );
}
