import { ManageAccount } from './firebaseconect.js';

document.getElementById("formulario-sesion").addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email1").value;
  const password = document.getElementById("password1").value;

  const account = new ManageAccount();
  account.authenticate(email, password)
         .then(() => {
             // Redirigir al usuario a la página de información meteorológica
             window.location.href = "login.html";
         })
         .catch(error => {
             // Manejar errores de autenticación
             console.error('Error de autenticación:', error);
         });
});

console.log('Formulario de Inicio de Sesión');