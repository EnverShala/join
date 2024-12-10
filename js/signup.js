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

  function checkPrivacyPolicy() {
    let agreeCheckbox = document.getElementById("agreeCheckbox").checked;

    if(agreeCheckbox) {
      document.getElementById("agreementText").classList.remove("redFont");
      document.getElementById("agreementLink").classList.remove("redFont");
      return true;
    } else {
      document.getElementById("agreementText").classList.add("redFont");
      document.getElementById("agreementLink").classList.add("redFont");
    }

    return false;
  }

  function checkSignUpButton() {
    let registerButton = document.getElementById("registerButton");

    if(checkSignUpConditions()) {
      registerButton.className = "submit__button";
      registerButton.onclick = registerUser;
      return true;
    } else {
      registerButton.className = "submit__button__disabled";
      registerButton.onclick = "";
      return false;
    }
  }

  function checkSignUpConditions() {
    if(checkName() && checkEmail() && checkPassword() && clearPasswordMismatchMessage() && checkPrivacyPolicy()) {
      return true;
    }

    return false;
  }

  function checkEmail() {
    let email = document.getElementById("userEmail").value.trim();
    let messageContainer = document.getElementById("requiredEmail");

    if(email.includes("@") &&
       email.includes(".") &&
       email.length > 8 &&
       (email[email.length - 3] == "." || email[email.length - 4] == ".") &&
       (email[email.length - 4] != "@" && email[email.length - 5] != "@")) {
      messageContainer.classList.add("d-none");
      document.getElementById("emailBox").classList.add("margin-bottom24px");
      return true;
    } else if(email == "") {
      messageContainer.classList.add("d-none");
      document.getElementById("emailBox").classList.add("margin-bottom24px");
    }
    else {
      messageContainer.classList.remove("d-none");
      document.getElementById("emailBox").classList.remove("margin-bottom24px");
    }
    return false;
  }

  function clearPasswordMismatchMessage() {
    let messageContainer = document.getElementById("requiredConfirmation");

    if(document.getElementById("userPassword").value.trim() == document.getElementById("confirmPassword").value.trim()) {
      messageContainer.classList.add("d-none");
      document.getElementById("confirmPasswordBox").classList.add("margin-bottom24px");
      return true;
    } else {
      messageContainer.classList.remove("d-none");
      document.getElementById("confirmPasswordBox").classList.remove("margin-bottom24px");
    }
    return false;
  }

  function checkPassword() {
    let messageContainer = document.getElementById("requiredPassword");

    let password = document.getElementById("userPassword").value;

    if(password.length >= 6) {
      messageContainer.classList.add("d-none");
      document.getElementById("passwordBox").classList.add("margin-bottom24px");
      return true;
    } else if(password == "") {
      messageContainer.classList.add("d-none");
      document.getElementById("passwordBox").classList.add("margin-bottom24px");
    }
    else {
      document.getElementById("passwordBox").classList.remove("margin-bottom24px");
      messageContainer.classList.remove("d-none");
    }

    clearPasswordMismatchMessage();

    return false;
  }

  function checkName() {
    let messageContainer = document.getElementById("requiredName");

    let name = document.getElementById("fullName").value.trim();

    if(name.length >= 5 && name.split(" ").length > 1) {
      messageContainer.classList.add("d-none");
      document.getElementById("nameBox").classList.add("margin-bottom24px");
      return true;
    } else if(name == "") {
      messageContainer.classList.add("d-none");
      document.getElementById("nameBox").classList.add("margin-bottom24px");
    }
     else {
      messageContainer.classList.remove("d-none");
      document.getElementById("nameBox").classList.remove("margin-bottom24px");
    }

    return false;
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