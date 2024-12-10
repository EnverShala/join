 /*
  ** function to initialize login site: logo animation, then show logo container function
  */


function init() {
  document.getElementById("logo-container").classList.remove("start");
  document.getElementById("myBody").style.background = "white";
  setTimeout(showLoginContainer, 1500);
}

 /*
  ** shows the login container if no account is logged in, else direct to summary
  */

function showLoginContainer() {
  let loggedInAccount = localStorage.getItem("loggedInAccount");
  if(loggedInAccount) {
    if(loggedInAccount != "") {
      location.href = "./summary.html";
      return;
    }
  }

  document.getElementById("main_wrapper").classList.remove("d-none");
  document.getElementById("footerID").classList.remove("d-none")
  document.getElementById("authOpt").classList.remove("d-none")
  document.getElementById("logo-container").classList.remove("d-none");
  document.getElementById("login_section").classList.remove("d-none");
  document.getElementById("logo-container").classList.remove("transition2s");
}

 /*
  ** function to check how to act on pressed key for the password input field
  */

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

function guestLogin() {
  window.location.href = 'summary.html';
}