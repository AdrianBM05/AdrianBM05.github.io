// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBH2El3mxJPdhHFixOLxT-VjN1djZNr0wI",
  authDomain: "bettracker-e4900.firebaseapp.com",
  projectId: "bettracker-e4900",
  storageBucket: "bettracker-e4900.firebasestorage.app",
  messagingSenderId: "994805962633",
  appId: "1:994805962633:web:5316c2cbf8a407687cf358",
  measurementId: "G-5FK0H86L26"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar Firestore
export const db = getFirestore(app);
