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

  const colorGanancia = bankroll.ganancias >= 0 ? 'text-green-500' : 'text-red-500';
  const colorROI = bankroll.roi >= 0 ? 'text-green-500' : 'text-red-500';

  const resumen = document.getElementById("resumen");
  resumen.innerHTML = `
    <div class="border rounded-2xl overflow-hidden shadow-sm bg-white max-w-xl mx-auto">
      <!-- Cabecera -->
      <div class="flex justify-between items-center px-4 py-3 border-b">
        <span class="text-sm text-gray-800 font-medium">Nombre del bankroll</span>
        <button class="text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 114 0 2 2 0 01-4 0zm5 0a2 2 0 114 0 2 2 0 01-4 0z" />
          </svg>
        </button>
      </div>

      <!-- Estadísticas -->
      <div class="flex justify-around items-center px-4 py-6 bg-gray-100">
        <div class="bg-gray-200 rounded-xl px-4 py-3 text-center w-28">
          <p class="text-xs text-gray-600">Inicial</p>
          <p class="font-semibold text-gray-800">${bankroll.bankInicial.toFixed(2)} €</p>
        </div>
        <div class="bg-gray-200 rounded-xl px-4 py-3 text-center w-28 ${colorROI}">
          <p class="text-xs text-gray-600">ROI</p>
          <p class="font-semibold">${bankroll.roi.toFixed(2)} %</p>
        </div>
        <div class="bg-gray-200 rounded-xl px-4 py-3 text-center w-28 ${colorGanancia}">
          <p class="text-xs text-gray-600">Beneficio</p>
          <p class="font-semibold">${bankroll.ganancias.toFixed(2)} €</p>
        </div>
      </div>
    </div>
  `;
}




cargarBankroll();
