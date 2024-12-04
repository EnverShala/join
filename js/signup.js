/*
** on keydown reaction function of password field
*/

  function onPasswordKeyDown() {
    let inputField = document.getElementById("userPassword").value;
    let pressedKey = event.key;
  
    if (inputField.length <= 1 && pressedKey == "Backspace") {
      document.getElementById("registerButton").disabled = true;
    } else if (pressedKey == "Enter") {
      if (inputField.length > 0) {
        document.getElementById("registerButton").disabled = false;
      }
    } else if (isMarkedCompletely(document.getElementById("userPassword")) && (pressedKey == "Backspace" || pressedKey == "Delete")) {
      document.getElementById("registerButton").disabled = true;
    } else {
      if (checkInvalidKeys(pressedKey) == false) {
        document.getElementById("registerButton").disabled = false;
      }
    }
  }

  function toggleSignUpButton() {
    document.getElementById("registerButton").disabled = document.getElementById("registerButton").disabled == true ? false : true;
  }

  function checkEmail() {
    let email = document.getElementById("userEmail").value;

    if(email.includes("@") &&
       email.includes(".") &&
       email.length > 8 &&
       (email[email.length - 3] == "." || email[email.length - 4] == ".")) {
      console.log("passt"); // tauschen gegen message/string
      return true;
    } else {
      console.log("keine gültige email addresse"); // tauschen gegen message/string
      return false;
    }
  }

  function clearPasswordMismatchMessage() {
    if(checkPassword() == true)  {
      // "passwort zu kurz" anzeige entfernen
      if(document.getElementById("userPassword").value == document.getElementById("confirmPassword").value) {
        console.log("passwörter stimmen überein");
      } else {
        console.log("passwörter stimmen nicht überein.");
      }
    } else {
      // anzeigen, dass passwort zu kurz ist
    }
  }

  function checkPassword() {
    let password = document.getElementById("userPassword").value.trim();

    return password.length >= 6;
  }

  function togglePasswordIcon() {

  }

  /*
  ** function to toggle signup agreement checkbox
  */

  function toggleCheckbox(checkboxId) {
    const checkbox = document.getElementById(checkboxId);
    checkbox.dataset.checked = checkbox.dataset.checked == true ? false : true;  // Umschalten des aktuellen Zustands der Checkbox
    
    if (checkbox.checked) {
      checkbox.style.backgroundColor = "#2a3647";
      checkbox.style.color = "white";
    } else {
      checkbox.style.backgroundColor = ""; // Setzt die Hintergrundfarbe zurück
      checkbox.style.color = "black";
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