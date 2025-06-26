import { db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { Bankroll } from './clases/Bankroll.js';

// 🔹 1. Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const idBankroll = params.get("id");

if (!idBankroll) {
  alert("Bankroll no encontrado.");
  window.location.href = "dashboard.html";
}

// 🔹 2. Cargar el bankroll desde Firestore
async function cargarBankroll() {
  const ref = doc(db, "bankrolls", idBankroll);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("El bankroll no existe.");
    window.location.href = "dashboard.html";
    return;
  }

  const data = snap.data();
  const bankroll = new Bankroll(
    snap.id,
    data.nombre,
    data.bankInicial,
    data.moneda,
    data.ganancias,
    data.apuestas,
    data.roi,
    data.creadoEn
  );

  mostrarResumen(bankroll);
}

function mostrarResumen(bankroll) {
  document.getElementById("nombreBankroll").textContent = bankroll.nombre;

  const resumen = document.getElementById("resumen");
  resumen.innerHTML = `
    <div class="bg-[#2d2948] p-4 rounded-xl">
      <p class="text-sm text-gray-300">Bank Inicial</p>
      <p class="text-xl font-bold">${bankroll.bankInicial.toFixed(2)} €</p>
    </div>
    <div class="bg-[#2d2948] p-4 rounded-xl">
      <p class="text-sm text-gray-300">Ganancias</p>
      <p class="text-xl font-bold ${bankroll.ganancias >= 0 ? 'text-green-400' : 'text-red-400'}">
        ${bankroll.ganancias.toFixed(2)} €
      </p>
    </div>
    <div class="bg-[#2d2948] p-4 rounded-xl">
      <p class="text-sm text-gray-300">ROI</p>
      <p class="text-xl font-bold">${bankroll.roi.toFixed(2)} %</p>
    </div>
    <div class="bg-[#2d2948] p-4 rounded-xl">
      <p class="text-sm text-gray-300">Apuestas</p>
      <p class="text-xl font-bold">${bankroll.apuestas}</p>
    </div>
  `;
}

cargarBankroll();
