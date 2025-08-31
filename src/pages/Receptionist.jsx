// src/pages/Receptionist.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function Receptionist() {
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    bill: "",
    age: "",
    gender: "",
    address: "",
    notes: "",
  });

  // Load patients from Firestore
  useEffect(() => {
    const q = query(collection(db, "patients"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPatients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Generate date-based incremental token (padded)
  const generateToken = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayPatients = patients.filter((p) => p.date === today);
    const number = String(todayPatients.length + 1).padStart(3, "0");
    return `${today}-${number}`;
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      bill: "",
      age: "",
      gender: "",
      address: "",
      notes: "",
    });
    setEditingPatient(null);
    setIsModalOpen(false);
  };

  const addPatient = async (e) => {
    e.preventDefault();
    const token = generateToken();
    await addDoc(collection(db, "patients"), {
      ...form,
      token,
      status: "waiting",
      date: new Date().toISOString().split("T")[0],
      timestamp: serverTimestamp(),
    });
    resetForm();
  };

  const updatePatient = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "patients", editingPatient.id), {
      ...form,
    });
    resetForm();
  };

  const markCompleted = async (id) => {
    await updateDoc(doc(db, "patients", id), { status: "done" });
  };

  const openEditModal = (patient) => {
    setEditingPatient(patient);
    setForm({
      name: patient.name || "",
      phone: patient.phone || "",
      bill: patient.bill || "",
      age: patient.age || "",
      gender: patient.gender || "",
      address: patient.address || "",
      notes: patient.notes || "",
    });
    setIsModalOpen(true);
  };

  // Filter + search patients
  const filteredPatients = patients.filter((p) => {
    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search);
    const matchFilter =
      filter === "all"
        ? true
        : filter === "waiting"
        ? p.status === "waiting"
        : p.status === "done";
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Receptionist Dashboard
      </h2>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or phone..."
          className="flex-1 px-3 py-2 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">All</option>
          <option value="waiting">Waiting</option>
          <option value="done">Completed</option>
        </select>
      </div>

      {/* Waiting Patients */}
      <Section
        title="Patient Queue"
        patients={filteredPatients.filter((p) => p.status === "waiting")}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
        openEditModal={openEditModal}
        markCompleted={markCompleted}
      />

      {/* Completed Patients */}
      <Section
        title="Completed Today"
        patients={filteredPatients.filter((p) => p.status === "done")}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
        openEditModal={openEditModal}
      />

      {/* Add New Patient Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-5 rounded-full shadow-lg hover:bg-blue-700 text-2xl"
      >
        +
      </button>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl space-y-3"
            >
              <h3 className="text-xl font-bold mb-2">
                {editingPatient ? "Edit Patient" : "Add New Patient"}
              </h3>
              <form
                onSubmit={editingPatient ? updatePatient : addPatient}
                className="space-y-3"
              >
                <input
                  type="text"
                  placeholder="Patient Name"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Age"
                    className="flex-1 px-3 py-2 border rounded-lg"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                  />
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border rounded-lg"
                  >
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
                <textarea
                  placeholder="Notes"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Bill (optional)"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.bill}
                  onChange={(e) => setForm({ ...form, bill: e.target.value })}
                />
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {editingPatient ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponent: Section for expandable patient cards
function Section({
  title,
  patients,
  expandedId,
  setExpandedId,
  openEditModal,
  markCompleted,
}) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-3 text-gray-700">{title}</h3>
      <div className="bg-white shadow rounded-lg divide-y overflow-hidden">
        {patients.length === 0 && (
          <p className="p-4 text-gray-500">No patients</p>
        )}
        {patients.map((p) => (
          <motion.div
            key={p.id}
            layout
            onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
            className="cursor-pointer"
          >
            {/* Card Header */}
            <div className="flex justify-between items-center p-4 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <strong className="text-blue-600">{p.token}</strong>
                <span className="font-medium text-gray-800">{p.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    p.status === "waiting"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {p.status === "waiting" ? "Waiting" : "Completed"}
                </span>
                {p.status === "done" && p.bill && (
                  <span className="ml-2 text-xs font-medium text-gray-700">
                    ₹{p.bill}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(p);
                  }}
                  className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                {markCompleted && p.status === "waiting" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markCompleted(p.id);
                    }}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>

            {/* Expandable Details */}
            <AnimatePresence>
              {expandedId === p.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-4 text-gray-700 space-y-1 text-sm overflow-hidden"
                >
                  {p.phone && (
                    <p>
                      <span className="font-medium text-gray-500">Phone:</span>{" "}
                      {p.phone}
                    </p>
                  )}
                  {p.age && (
                    <p>
                      <span className="font-medium text-gray-500">Age:</span>{" "}
                      {p.age}
                    </p>
                  )}
                  {p.gender && (
                    <p>
                      <span className="font-medium text-gray-500">Gender:</span>{" "}
                      {p.gender}
                    </p>
                  )}
                  {p.address && (
                    <p>
                      <span className="font-medium text-gray-500">
                        Address:
                      </span>{" "}
                      {p.address}
                    </p>
                  )}
                  {p.notes && (
                    <p>
                      <span className="font-medium text-gray-500">Notes:</span>{" "}
                      {p.notes}
                    </p>
                  )}
                  {p.bill && (
                    <p>
                      <span className="font-medium text-gray-500">Bill:</span> ₹
                      {p.bill}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
