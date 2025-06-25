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