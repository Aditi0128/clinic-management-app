import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDm6n4dMCECljYRCmqaHGgM82rYSRJY8AA",
  authDomain: "redirection-n8xuv.firebaseapp.com",
  projectId: "redirection-n8xuv",
  storageBucket: "redirection-n8xuv.firebasestorage.app",
  messagingSenderId: "568444272180",
  appId: "1:568444272180:web:941ef5e82a3c535836d461"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ⬇️ New helper function
export async function listTodayQueue() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const q = query(
    collection(db, "patients"),
    where("timestamp", ">=", today.getTime()),
    where("timestamp", "<", tomorrow.getTime())
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
export async function updateVisitPrescription(patientId, prescriptionText) {
  const patientRef = doc(db, "patients", patientId);
  await updateDoc(patientRef, {
    prescription: prescriptionText,
    status: "completed", // optional, mark as done
  });
}

export async function updateVisitStatus(patientId, newStatus) {
  const patientRef = doc(db, "patients", patientId);
  await updateDoc(patientRef, {
    status: newStatus,
  });
}