import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getAuth } from "firebase/auth";

export async function logEvent(action, details = {}) {
  try {
    const auth = getAuth();
    const uid = auth.currentUser?.uid || null;
    await addDoc(collection(db, "logs"), {
      action,
      details,
      uid,
      at: serverTimestamp(),
    });
    // Also echo to console for local debugging
    // eslint-disable-next-line no-console
    console.info("[LOG]", action, details);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Log failed", e);
  }
}
