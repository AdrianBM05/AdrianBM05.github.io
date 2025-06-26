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

  const colorGanancia = bankroll.ganancias >= 0 ? 'text-green-400' : 'text-red-400';
  const colorROI = bankroll.roi >= 0 ? 'text-green-400' : 'text-red-400';

  const resumen = document.getElementById("resumen");
  resumen.innerHTML = `
    <div class="bankroll-card bg-[#2d2948] rounded-2xl p-4 border border-gray-600 shadow-md transition">
      <div class="flex justify-between items-center mb-4">
        <span class="text-sm font-medium text-white">${bankroll.nombre}</span>
        <button class="text-white hover:text-purple-400 text-lg" onclick="alert('Opciones futuras')">⚙️</button>
      </div>
      <div class="flex justify-between gap-2">
        <div class="flex-1 bg-[#1e1b3a] rounded-xl py-2 text-center text-sm text-gray-300 shadow-inner">
          Inicial<br><strong class="text-white">${bankroll.bankInicial.toFixed(2)} €</strong>
        </div>
        <div class="flex-1 bg-[#1e1b3a] rounded-xl py-2 text-center text-sm shadow-inner ${colorROI}">
          ROI<br><strong>${bankroll.roi.toFixed(2)} %</strong>
        </div>
        <div class="flex-1 bg-[#1e1b3a] rounded-xl py-2 text-center text-sm shadow-inner ${colorGanancia}">
          Beneficio<br><strong>${bankroll.ganancias.toFixed(2)} €</strong>
        </div>
      </div>
    </div>
  `;
}



cargarBankroll();
