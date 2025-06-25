// js/bankrolls.js

document.addEventListener("DOMContentLoaded", renderizarBankrolls);

function crearBankroll() {
  const nombre = document.getElementById("nombreBankroll").value.trim();
  const bankPrincipal = parseFloat(document.getElementById("bankPrincipal").value);

  if (!nombre || isNaN(bankPrincipal)) return alert("Rellena todos los campos correctamente");

  const nuevoBankroll = {
    id: Date.now(),
    nombre: nombre,
    bankPrincipal: bankPrincipal,
    beneficio: 0,
    apuestas: [], // se añadirá luego
    creado: new Date().toISOString()
  };

  const lista = JSON.parse(localStorage.getItem("bankrolls") || "[]");
  lista.push(nuevoBankroll);
  localStorage.setItem("bankrolls", JSON.stringify(lista));

  cerrarModal();
  renderizarBankrolls();
}

function renderizarBankrolls() {
  const contenedor = document.getElementById("bankrollGrid");
  contenedor.innerHTML = "";

  let lista = JSON.parse(localStorage.getItem("bankrolls") || "[]");

  // Ordenar según selector
  const criterio = document.getElementById("ordenar")?.value || "fecha";
  if (criterio === "nombre") lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
  if (criterio === "beneficio") lista.sort((a, b) => b.beneficio - a.beneficio);
  if (criterio === "fecha") lista.sort((a, b) => b.id - a.id);

  lista.forEach(b => {
    const totalApuestas = b.apuestas?.length || 0;
    const roi = b.bankPrincipal > 0 ? ((b.beneficio / b.bankPrincipal) * 100).toFixed(2) : "0.00";
    const color = b.beneficio >= 0 ? "green-600" : "red-600";
    const borde = b.beneficio >= 0 ? "border-l-green-600" : "border-l-red-600";
    const beneficioText = b.beneficio >= 0 ? `+${b.beneficio} €` : `${b.beneficio} €`;

    const tarjeta = document.createElement("div");
    tarjeta.className = `bg-white rounded-xl shadow-md p-4 border-l-4 ${borde} transition hover:bg-gray-100 cursor-pointer`;
    tarjeta.onclick = () => {
      window.location.href = `bankroll.html?id=${b.id}`;
    };

    tarjeta.innerHTML = `
      <h3 class="text-xl font-semibold text-${color}">${b.nombre}</h3>
      <p class="text-sm text-gray-600 mt-1">Bank principal: ${b.bankPrincipal} €</p>
      <p class="text-sm font-medium text-${color}">Beneficio: ${beneficioText}</p>
      <p class="text-sm text-gray-700">Apuestas: ${totalApuestas}</p>
      <p class="text-sm text-gray-700">% ROI: ${roi}%</p>
    `;

    contenedor.appendChild(tarjeta);
  });
}

function ordenarBankrolls() {
  renderizarBankrolls();
}
