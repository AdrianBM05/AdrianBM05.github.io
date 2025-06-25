// auth.js

// Define aquí tus credenciales (puedes cambiarlas por las que tú quieras)
const USUARIO_VALIDO = "abejmor";
const CONTRASENA_VALIDA = "Calvario76";

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  if (user === USUARIO_VALIDO && pass === CONTRASENA_VALIDA) {
    // Guardamos que ha iniciado sesión (opcional)
    localStorage.setItem("logueado", "true");
    window.location.href = "pages/dashboard.html";
  } else {
    errorMsg.classList.remove("hidden");
  }
});
