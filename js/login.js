// scripts.js

/**
 * Funktion, die beim Laden des Logos eine Animation ausführt.
 */
document.addEventListener("DOMContentLoaded", function () {
  const logo = document.getElementById("logo");
  //logo.style.transition = "transform 1s, opacity 1s";
  //logo.style.transform = "translateY(0)";
  //logo.style.opacity = "1";
});

/**
 * Funktion für den Demo-Login.
 * Diese Funktion setzt vordefinierte Demo-Anmeldeinformationen und leitet den Benutzer weiter zum Dashboard.
 */
function demoLogin() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Setzt Demo-Anmeldeinformationen
  emailInput.value = "demo@example.com";
  passwordInput.value = "demopassword";

  // Weiterleitung zur Dashboard-Seite
  window.location.href = "summary.html";
}

/**
 * Funktion zur Validierung der E-Mail-Adresse.
 * @param {string} email - Die zu validierende E-Mail-Adresse.
 * @returns {boolean} - True, wenn die E-Mail-Adresse gültig ist, andernfalls false.
 */
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Funktion zur Validierung des Passworts.
 * @param {string} password - Das zu validierende Passwort.
 * @returns {boolean} - True, wenn das Passwort gültig ist, andernfalls false.
 */
function validatePassword(password) {
  // Beispielhafte Passwortvalidierung: mindestens 8 Zeichen
  return password.length >= 8;
}

// Event-Listener für das Absenden des Formulars
//document.querySelector("form").addEventListener("submit", handleSubmit);

// Event-Listener für den Demo-Login
//document.querySelector(".demo-login button").addEventListener("click", demoLogin);

function init() {
  document.getElementById("logo-container").classList.remove("start");
  document.getElementById("myBody").style.background = "white";
  setTimeout(showLoginContainer, 1500);
}

function showLoginContainer() {
  document.getElementById("main_wrapper").classList.remove("d-none");
  document.getElementById("footerID").classList.remove("d-none")
  document.getElementById("logo-container").classList.remove("d-none");
  document.getElementById("login_section").classList.remove("d-none");
  document.getElementById("logo-container").classList.remove("transition2s");
}

function onPasswordKeyDown() {
  let inputField = document.getElementById("userPassword").value;
  let pressedKey = event.key;

  if (inputField.length <= 1 && pressedKey == "Backspace") {
    document.getElementById("loginButton").disabled = true;
  } else if (pressedKey == "Enter") {
    if (inputField.length > 0) {
      document.getElementById("loginButton").disabled = false;
    }
  } else if (isMarkedCompletely(document.getElementById("userPassword")) && (pressedKey == "Backspace" || pressedKey == "Delete")) {
    document.getElementById("loginButton").disabled = true;
  } else {
    if (checkInvalidKeys(pressedKey) == false) {
      document.getElementById("loginButton").disabled = false;
    }
  }
}

 /*
  ** function to check invalid keys
  */

function checkInvalidKeys(key) {
  switch (key) {
    case "Backspace":
    case "Escape":
    case "Shift":
    case "Alt":
    case "AltGraph":
    case "Space":
    case "Control":
    case "F1":
    case "F2":
    case "F3":
    case "F4":
    case "F5":
    case "F6":
    case "F7":
    case "F8":
    case "F9":
    case "F10":
    case "F11":
    case "F12":
    case "PageUp":
    case "PageDown":
    case "Home":
    case "End":
    case "Insert":
    case "Meta":
    case "ContextMenu":
    case "ArrowLeft":
    case "ArrowRight":
    case "ArrowUp":
    case "ArrowDown":
    case "LaunchApplication2":
    case "LaunchMail":
    case "NumLock":
    case "Pause":
    case "ScrollLock":
      return true;
      break;
    default:
      return false;
      break;
  }
}

 /*
  ** checks if the input of an input field is marked completely
  */

function isMarkedCompletely(inputField) {
  return inputField.selectionStart == 0 && inputField.selectionEnd == inputField.value.length;
}

/*
** routes guest to summary page
*/

document.getElementById('guestButton').addEventListener('click', function(event) {
  event.preventDefault();
  window.location.href = 'summary.html';
});


// Show Username on the Page
document.addEventListener('DOMContentLoaded', (event) => {
  const username = localStorage.getItem('username');
  if (username) {
      document.getElementById('header-profile-icon').textContent = username.charAt(0).toUpperCase();
  }
});
