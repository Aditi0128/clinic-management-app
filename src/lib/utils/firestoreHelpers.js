import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  orderBy,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { db } from "../lib/firebase";

// Auto-increment token
export async function getNextToken() {
  const counterRef = doc(db, "meta", "tokenCounter");

  const newToken = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? snap.data().current : 0;
    const next = current + 1;

    tx.set(counterRef, { current: next }, { merge: true });
    return next;
  });

  return newToken;
}

// Create or fetch patient by phone
export async function createOrGetPatientByPhone({ name, phone }) {
  const patientsRef = collection(db, "patients");
  const q = query(patientsRef, where("phone", "==", phone));
  const snap = await getDocs(q);

  if (!snap.empty) {
    const docSnap = snap.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  }

  const created = await addDoc(patientsRef, {
    name,
    phone,
    createdAt: serverTimestamp(),
  });

  const newSnap = await getDoc(created);
  return { id: created.id, ...newSnap.data() };
}

// Create a visit
export async function createVisit({ patientId, token, bill, notes }) {
  const visitsRef = collection(db, "visits");
  const created = await addDoc(visitsRef, {
    patientId,
    token,
    bill: Number(bill) || 0,
    notes: notes || "",
    status: "queued", // queued | seen | completed
    createdAt: serverTimestamp(),
    prescription: "",
  });
  return created.id;
}

// Queue list
export async function listTodayQueue() {
  const q = query(collection(db, "visits"), orderBy("token", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Patient history
export async function listPatientHistory({ phone }) {
  const patients = collection(db, "patients");
  const ps = await getDocs(query(patients, where("phone", "==", phone)));
  if (ps.empty) return [];

  const pid = ps.docs[0].id;
  const visits = await getDocs(
    query(
      collection(db, "visits"),
      where("patientId", "==", pid),
      orderBy("token", "desc")
    )
  );
  return visits.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Update prescription
export async function updateVisitPrescription({
  visitId,
  prescription,
  status = "seen",
}) {
  const ref = doc(db, "visits", visitId);
  await updateDoc(ref, { prescription, status });
}

// Update visit status
export async function updateVisitStatus({ visitId, status }) {
  const ref = doc(db, "visits", visitId);
  await updateDoc(ref, { status });
}
