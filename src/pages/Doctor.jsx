// src/pages/Doctor.jsx
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

export default function Doctor() {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [prescription, setPrescription] = useState("");

  // Load patients
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "patients"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPatients(
        list.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds)
      );
    });
    return () => unsub();
  }, []);

  const handleComplete = async () => {
    if (!selected) return;
    await updateDoc(doc(db, "patients", selected.id), {
      status: "done",
      prescription,
    });
    setSelected(null);
    setPrescription("");
  };

  // Filter patients
  const waitingPatients = patients.filter((p) => p.status === "waiting");
  const completedPatients = patients.filter((p) => p.status === "done");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Doctor Dashboard
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Waiting Patients */}
        <PatientList
          title="Waiting Patients"
          patients={waitingPatients}
          setSelected={setSelected}
        />

        {/* Completed Patients */}
        <PatientList
          title="Completed Patients"
          patients={completedPatients}
          setSelected={setSelected}
          showPrescription
        />
      </div>

      {/* Patient Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl overflow-y-auto max-h-[90vh]"
            >
              <h3 className="text-2xl font-bold mb-2">{selected.name}</h3>
              <p className="text-sm text-gray-500 mb-4">
                Token {selected.token} • {selected.phone}
              </p>

              {/* Expanded Details */}
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                {selected.age && <Card label="Age" value={selected.age} />}
                {selected.gender && (
                  <Card label="Gender" value={selected.gender} />
                )}
                {selected.address && (
                  <Card label="Address" value={selected.address} />
                )}
                {selected.bill && (
                  <Card label="Bill" value={`₹${selected.bill}`} />
                )}
              </div>

              {selected.notes && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500">Notes</div>
                  <div className="text-sm text-gray-700">{selected.notes}</div>
                </div>
              )}

              {/* Prescription */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">Prescription</div>
                <textarea
                  placeholder="Write prescription here..."
                  className="w-full px-3 py-2 border rounded-lg text-gray-700"
                  value={prescription || selected.prescription || ""}
                  onChange={(e) => setPrescription(e.target.value)}
                />
              </div>

              {/* Past Visits */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Past Visits</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {patients
                    .filter(
                      (p) =>
                        p.phone === selected.phone &&
                        p.id !== selected.id &&
                        p.prescription
                    )
                    .sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds)
                    .map((visit) => (
                      <div
                        key={visit.id}
                        className="p-2 rounded-lg bg-gray-50 border text-sm"
                      >
                        <div className="text-xs text-gray-500">
                          {new Date(
                            visit.timestamp?.seconds * 1000
                          ).toLocaleDateString()}
                        </div>
                        <div className="font-medium text-gray-800">
                          Rx: {visit.prescription}
                        </div>
                        {visit.notes && (
                          <div className="text-gray-600 text-xs">
                            Notes: {visit.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  {patients.filter(
                    (p) =>
                      p.phone === selected.phone &&
                      p.id !== selected.id &&
                      p.prescription
                  ).length === 0 && (
                    <div className="text-gray-500 text-sm">
                      No past visits found.
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Close
                </button>
                {selected.status !== "done" && (
                  <button
                    onClick={handleComplete}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Complete
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponent: Patient List Card
function PatientList({ title, patients, setSelected, showPrescription }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <div className="space-y-3 max-h-[70vh] overflow-y-auto">
        {patients.length === 0 && <p className="text-gray-500">No patients</p>}
        {patients.map((p) => (
          <motion.div
            key={p.id}
            layout
            onClick={() => setSelected(p)}
            className="p-3 border rounded-xl hover:shadow-md cursor-pointer bg-white transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-800">{p.name}</div>
                <div className="text-xs text-gray-500">
                  Token {p.token} • {p.phone}
                </div>
                {showPrescription && p.prescription && (
                  <div className="text-xs text-gray-700 mt-1">
                    Rx: {p.prescription}
                  </div>
                )}
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  p.status === "waiting"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {p.status === "waiting" ? "Waiting" : "Completed"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Subcomponent: Detail Card
function Card({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-gray-50 border">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-semibold text-gray-800">{value}</div>
    </div>
  );
}
