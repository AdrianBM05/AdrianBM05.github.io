import { db } from './firebase.js';
import { collection, query, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// UID fijo ya que no usas login
const UID = "abejmor";

// Cargar bankrolls al entrar
window.addEventListener("DOMContentLoaded", async () => {
  cargarBankrolls();
});

// Cerrar sesión deshabilitado (puedes ocultar el botón si quieres)
document.getElementById("logoutBtn").addEventListener("click", () => {
  alert("El sistema ya no tiene login. Este botón será desactivado.");
});

async function cargarBankrolls() {
  const contenedor = document.getElementById("bankrollsContainer");
  contenedor.innerHTML = "";

  const ref = collection(db, "bankrolls");
  const q = query(ref); // si quieres filtrar por uid: where("uid", "==", UID)
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();
    const tarjeta = document.createElement("div");
    tarjeta.className = "bg-[#2d2948] p-4 rounded-xl shadow hover:scale-[1.01] transition cursor-pointer";
    tarjeta.innerHTML = `
      <h3 class="text-lg font-bold mb-2">${data.nombre}</h3>
      <p>Inicial: ${data.bankInicial}${data.moneda}</p>
      <p class="${data.ganancias >= 0 ? 'text-green-400' : 'text-red-400'}">Ganancia: ${data.ganancias.toFixed(2)}${data.moneda}</p>
      <p>Apuestas: ${data.apuestas || 0}</p>
      <p>ROI: ${data.roi ? data.roi.toFixed(2) + '%' : '0%'}</p>
    `;
    tarjeta.addEventListener("click", () => {
      window.location.href = `bankroll.html?id=${doc.id}`;
    });
    contenedor.appendChild(tarjeta);
  });
}

document.getElementById("addBankrollBtn").addEventListener("click", async () => {
  const nombre = prompt("Nombre del bankroll:");
  const bankInicial = parseFloat(prompt("Bank inicial (€ o u):"));
  const moneda = prompt("¿Moneda o unidad? (€, u)", "€");

  if (nombre && !isNaN(bankInicial)) {
    await addDoc(collection(db, "bankrolls"), {
      uid: UID,
      nombre,
      bankInicial,
      moneda,
      ganancias: 0,
      apuestas: 0,
      roi: 0,
      creadoEn: new Date()
    });
    cargarBankrolls();
  }
});
