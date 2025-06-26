import { db } from "./firebase.js";
import {
  collection,
  query,
  getDocs,
  addDoc,
  deleteDoc,
  doc as firestoreDoc,
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
      creadoEn: new Date(),
    });

    modal.classList.add("hidden");
    window.location.href = `bankroll.html?id=${docRef.id}`;
  });
});

async function cargarBankrolls() {
  const contenedor = document.getElementById("bankrollsContainer");
  contenedor.innerHTML = "";

  const ref = collection(db, "bankrolls");
  const q = query(ref);
  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const ganancias = data.ganancias || 0;
    const roi = data.roi || 0;
    const apuestas = data.apuestas || 0;
    const bankInicial = data.bankInicial || 0;

    const colorGanancia = ganancias >= 0 ? "text-green-600" : "text-red-600";
    const colorROI = roi >= 0 ? "text-green-600" : "text-red-600";

    const tarjeta = document.createElement("div");
    tarjeta.className =
      "w-full bg-white text-gray-800 rounded-2xl shadow-md overflow-hidden max-w-md mx-auto cursor-pointer transition-transform hover:scale-[1.01]";

    tarjeta.innerHTML = `
      <!-- Cabecera con menú -->
      <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200 relative">
        <span class="text-sm font-semibold truncate w-4/5">${data.nombre}</span>

        <div class="relative">
          <button class="text-gray-500 hover:text-gray-700" onclick="event.stopPropagation(); toggleMenu(this)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 114 0 2 2 0 01-4 0zm5 0a2 2 0 114 0 2 2 0 01-4 0z" />
            </svg>
          </button>

          <!-- Menú desplegable -->
          <div class="hidden absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md z-50 text-sm text-gray-800 menu-opciones">
            <button class="w-full text-left px-3 py-2 hover:bg-gray-100" onclick="event.stopPropagation(); modificarBankroll('${docSnap.id}')">Modificar</button>
            <button class="w-full text-left px-3 py-2 hover:bg-red-100 text-red-600" onclick="event.stopPropagation(); confirmarEliminar('${docSnap.id}', '${data.nombre}')">Eliminar</button>
          </div>
        </div>
      </div>

      <!-- Datos -->
      <div class="flex justify-between items-center px-3 py-2 border-b border-gray-200">
        <div class="bg-[#ece9f5] rounded-xl px-4 py-2 text-center w-1/3 mx-1">
          <p class="text-[11px] text-gray-600">Inicial</p>
          <p class="font-bold text-sm text-gray-800">${bankInicial.toFixed(2)} €</p>
        </div>
        <div class="bg-[#ece9f5] rounded-xl px-4 py-2 text-center w-1/3 mx-1 ${colorROI}">
          <p class="text-[11px] text-gray-600">ROI</p>
          <p class="font-bold text-sm">${roi.toFixed(2)}%</p>
        </div>
        <div class="bg-[#ece9f5] rounded-xl px-4 py-2 text-center w-1/3 mx-1 ${colorGanancia}">
          <p class="text-[11px] text-gray-600">Beneficio</p>
          <p class="font-bold text-sm">${ganancias.toFixed(2)} €</p>
        </div>
      </div>

      <!-- Apuestas -->
      <div class="px-4 py-2 bg-white border-t border-gray-200">
        <p class="text-xs text-gray-500">Apuestas registradas: <span class="font-semibold text-gray-800">${apuestas}</span></p>
      </div>
    `;

    tarjeta.addEventListener("click", () => {
      window.location.href = `bankroll.html?id=${docSnap.id}`;
    });

    contenedor.appendChild(tarjeta);
  });
}

// Mostrar/ocultar menú contextual
function toggleMenu(btn) {
  document.querySelectorAll('.menu-opciones').forEach(menu => menu.classList.add("hidden"));
  const menu = btn.parentElement.querySelector('.menu-opciones');
  menu.classList.toggle("hidden");
}

// Cierra el menú al hacer clic fuera
document.addEventListener("click", () => {
  document.querySelectorAll('.menu-opciones').forEach(menu => menu.classList.add("hidden"));
});

// Confirmación antes de eliminar
function confirmarEliminar(id, nombre) {
  if (confirm(`¿Seguro que deseas eliminar el bankroll "${nombre}"? Esta acción no se puede deshacer.`)) {
    eliminarBankroll(id);
  }
}

// Elimina el documento de Firestore
async function eliminarBankroll(id) {
  try {
    await deleteDoc(firestoreDoc(db, "bankrolls", id));
    await cargarBankrolls(); // Recarga la lista
  } catch (error) {
    alert("Error al eliminar el bankroll.");
    console.error(error);
  }
}

// Por ahora solo muestra alerta
function modificarBankroll(id) {
  alert("Funcionalidad de modificación próximamente.");
}
