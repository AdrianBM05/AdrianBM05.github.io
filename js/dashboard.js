import { db } from "./firebase.js";
import {
  collection,
  query,
  getDocs,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// UID fijo ya que no usas login
const UID = "abejmor";

// Al cargar la página
window.addEventListener("DOMContentLoaded", async () => {
  await cargarBankrolls();

  // Elementos del DOM
  const addBtn = document.getElementById("addBankrollBtn");
  const modal = document.getElementById("modalOverlay");
  const cancelBtn = document.getElementById("cancelBtn");
  const confirmBtn = document.getElementById("confirmBtn");
  const nombreInput = document.getElementById("nombreInput");
  const capitalInput = document.getElementById("capitalInput");

  // Mostrar modal
  addBtn.addEventListener("click", () => {
    nombreInput.value = "";
    capitalInput.value = "";
    modal.classList.remove("hidden");
  });

  // Cancelar
  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Confirmar y crear bankroll
  confirmBtn.addEventListener("click", async () => {
    const nombre = nombreInput.value.trim();
    const capital = parseFloat(capitalInput.value);

    if (!nombre || isNaN(capital)) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    const docRef = await addDoc(collection(db, "bankrolls"), {
      nombre,
      bankInicial: capital,
      moneda: "€",
      ganancias: 0,
      apuestas: 0,
      roi: 0,
      uid: UID,
      creadoEn: new Date()
    });

    modal.classList.add("hidden");
    window.location.href = `bankroll.html?id=${docRef.id}`;
  });
});

// Función para cargar los bankrolls
async function cargarBankrolls() {
  const contenedor = document.getElementById("bankrollsContainer");
  contenedor.innerHTML = "";

  const ref = collection(db, "bankrolls");
  const q = query(ref);
  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    const data = doc.data();
    const tarjeta = document.createElement("div");
    tarjeta.className =
      "bg-[#2d2948] p-4 rounded-xl shadow hover:scale-[1.01] transition cursor-pointer";
    tarjeta.innerHTML = `
      <h3 class="text-lg font-bold mb-2">${data.nombre}</h3>
      <p>Inicial: ${data.bankInicial}${data.moneda}</p>
      <p class="${data.ganancias >= 0 ? "text-green-400" : "text-red-400"}">
        Ganancia: ${data.ganancias.toFixed(2)}${data.moneda}
      </p>
      <p>Apuestas: ${data.apuestas || 0}</p>
      <p>ROI: ${data.roi ? data.roi.toFixed(2) + "%" : "0%"}</p>
    `;
    tarjeta.addEventListener("click", () => {
      window.location.href = `bankroll.html?id=${doc.id}`;
    });
    contenedor.appendChild(tarjeta);
  });
}
