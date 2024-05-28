import { ManageAccount } from './firebaseconect.js';

document.getElementById("formulario-crear").addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const account = new ManageAccount();
  account.register(email, password)
         .then(() => {
             // Redirigir al usuario a la página de inicio de sesión
             window.location.href = "../main/login.html";
         })
         .catch(error => {
             // Manejar errores de registro
             console.error('Error de registro:', error);
         });
});