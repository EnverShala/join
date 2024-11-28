/*
** sign up form validation
*/

document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('register');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Simple validation
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (password.length < 6) { 
            alert('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (!document.getElementById('acceptPolicy').checked) {
            alert('You must accept the Privacy Policy to sign up.');
            return;
        }

        // If validation passes, you can proceed with the sign-up logic
        // Example: sending data to the server (e.g., via fetch API)
        alert('Sign up successful!'); // Placeholder for actual sign-up logic

        // Clear form fields
        signupForm.reset();
    });
});

/*
** show login container
*/

  function showLoginContainer() {
    document.getElementById("main_wrapper").classList.remove("d-none");
    document.getElementById("login_section").classList.remove("d-none");
  }

/*
** on keydown reaction function of password field
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