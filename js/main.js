// Mostrar mensaje en la consola
console.log("¡Bienvenido al control de apuestas!");

// Mostrar mensaje en la web
document.addEventListener("DOMContentLoaded", function() {
    const lista = document.querySelector('.bankroll-list');
    if (lista) {
        const mensaje = document.createElement('li');
        mensaje.textContent = "¡Personaliza tus bankrolls aquí!";
        mensaje.style.color = "#007bff";
        mensaje.style.fontWeight = "normal";
        lista.appendChild(mensaje);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const btnNuevo = document.querySelector('.btn-nuevo');
    const modal = document.getElementById('modal-bankroll');
    const btnCerrar = document.querySelector('.btn-cerrar');
    const form = document.getElementById('form-bankroll');
    const lista = document.querySelector('.bankroll-list');
    const noBankrolls = document.querySelector('.no-bankrolls');

    // Cargar bankrolls guardados
    function cargarBankrolls() {
        lista.innerHTML = '';
        const datos = JSON.parse(localStorage.getItem('bankrolls') || '[]');
        if (datos.length === 0) {
            noBankrolls.style.display = 'block';
        } else {
            noBankrolls.style.display = 'none';
            datos.forEach(b => {
                lista.appendChild(crearBankrollCard(b));
            });
        }
    }

    // Crear elemento de tarjeta
    function crearBankrollCard(b) {
        const li = document.createElement('li');
        li.className = 'bankroll-card';
        li.innerHTML = `
            <div class="bankroll-header">
                <span class="bankroll-title">${b.nombre}</span>
                <button class="bankroll-settings" title="Configurar">&#9881;</button>
            </div>
            <div class="bankroll-stats">
                <div class="stat">
                    <span class="stat-label">ROI</span>
                    <span class="stat-value positivo">0.00%</span>
                </div>
                <div class="stat">
                    <span class="stat-label">PROGRESIÓN</span>
                    <span class="stat-value positivo">0.00%</span>
                </div>
            </div>
            <div class="stat">
                <span class="stat-label">Capital inicial</span>
                <span class="stat-value">${b.capital}€</span>
            </div>
        `;
        return li;
    }

    // Mostrar modal
    btnNuevo.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Cerrar modal
    btnCerrar.addEventListener('click', () => {
        modal.style.display = 'none';
        form.reset();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            form.reset();
        }
    });

    // Guardar nuevo bankroll
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const nombre = form.nombre.value.trim();
        const capital = form.capital.value.trim();
        if (nombre && capital) {
            const datos = JSON.parse(localStorage.getItem('bankrolls') || '[]');
            datos.push({ nombre, capital });
            localStorage.setItem('bankrolls', JSON.stringify(datos));
            cargarBankrolls();
            modal.style.display = 'none';
            form.reset();
        }
    });

    // --- MODAL DE EDICIÓN ---
    const modalEditar = document.getElementById('modal-editar-bankroll');
    const formEditar = document.getElementById('form-editar-bankroll');
    const btnCerrarEditar = document.querySelector('.btn-cerrar-editar');
    const btnEliminar = document.querySelector('.btn-eliminar');
    let bankrollEditIndex = null;

    // Delegación para abrir modal de edición
    lista.addEventListener('click', function(e) {
        if (e.target.classList.contains('bankroll-settings')) {
            const index = Array.from(lista.children).indexOf(e.target.closest('.bankroll-card'));
            const datos = JSON.parse(localStorage.getItem('bankrolls') || '[]');
            bankrollEditIndex = index;
            formEditar['editar-nombre'].value = datos[index].nombre;
            formEditar['editar-capital'].value = datos[index].capital;
            modalEditar.style.display = 'flex';
        }
    });

    // Guardar cambios
    formEditar.addEventListener('submit', function(e) {
        e.preventDefault();
        const datos = JSON.parse(localStorage.getItem('bankrolls') || '[]');
        datos[bankrollEditIndex].nombre = formEditar['editar-nombre'].value.trim();
        datos[bankrollEditIndex].capital = formEditar['editar-capital'].value.trim();
        localStorage.setItem('bankrolls', JSON.stringify(datos));
        modalEditar.style.display = 'none';
        cargarBankrolls();
    });

    // Eliminar bankroll
    btnEliminar.addEventListener('click', function() {
        if (confirm('¿Seguro que quieres eliminar este bankroll?')) {
            const datos = JSON.parse(localStorage.getItem('bankrolls') || '[]');
            datos.splice(bankrollEditIndex, 1);
            localStorage.setItem('bankrolls', JSON.stringify(datos));
            modalEditar.style.display = 'none';
            cargarBankrolls();
        }
    });

    // Cerrar modal de edición
    btnCerrarEditar.addEventListener('click', function() {
        modalEditar.style.display = 'none';
        formEditar.reset();
    });

    modalEditar.addEventListener('click', function(e) {
        if (e.target === modalEditar) {
            modalEditar.style.display = 'none';
            formEditar.reset();
        }
    });

    // Inicializar
    cargarBankrolls();
});