import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBH2El3mxJPdhHFixOLxT-VjN1djZNr0wI",
  authDomain: "bettracker-e4900.firebaseapp.com",
  projectId: "bettracker-e4900",
  storageBucket: "bettracker-e4900.firebasestorage.app",
  messagingSenderId: "994805962633",
  appId: "1:994805962633:web:5316c2cbf8a407687cf358",
  measurementId: "G-5FK0H86L26"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.getElementById("loginBtn").addEventListener("click", async () => {
  const btn = document.getElementById("loginBtn");
  btn.disabled = true;
  btn.textContent = "Iniciando...";

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Guardamos info mínima en localStorage si quieres reutilizar
    localStorage.setItem("user", JSON.stringify({
      uid: user.uid,
      nombre: user.displayName
    }));

    // Redirigir al dashboard
    window.location.href = "../dashboard.html";
  } catch (error) {
    alert("Error al iniciar sesión: " + error.message);
    console.error(error);
    btn.disabled = false;
    btn.textContent = "Iniciar sesión con Google";
  }
});
