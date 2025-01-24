 /*
 ** toggles the signup button disability
 */

  function toggleSignUpButton() {
    document.getElementById("registerButton").disabled = document.getElementById("registerButton").disabled == true ? false : true;
  }

 /*
 ** checks if the privacy policy checkbox is checked, if not, the font color will turn red
 */

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

 /*
 ** checks signup conditions, if true, signup button will be manually enabled, else manually disabled
 */

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

 /*
 ** checks the signup conditions (correct name, email, password, password confirmation, privacy policy checkbox/agreement)
 */

  function checkSignUpConditions() {
    if(checkName() && checkEmail() && checkPassword() && clearPasswordMismatchMessage() && checkPrivacyPolicy()) {
      return true;
    }

    return false;
  }

 /*
 ** checks if the email is a valid email address plus shows messages and changes css (of the messages/inputfields)
 */

  function checkEmail() {
    let email = document.getElementById("userEmail").value.trim();
    let messageContainer = document.getElementById("requiredEmail");

    if(isEmailValid(email)) {
      messageContainer.classList.add("d-none");
      document.getElementById("emailBox").classList.add("margin-bottom24px");
      return true;
    } else if(email == "") {
      messageContainer.classList.add("d-none");
      document.getElementById("emailBox").classList.add("margin-bottom24px");
    } else {
      messageContainer.classList.remove("d-none");
      document.getElementById("emailBox").classList.remove("margin-bottom24px");
    }
    return false;
  }

 /*
 ** checks if the 2 entered passwords match
 */

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

 /*
 ** checks if the password is longer than 6 characters & also updates password confirmation message/check
 */

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

 /*
 ** checks whether the name consists of at least 5 characters and 2 words
 */

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

   /*
  ** function to toggle the password icon and also the password inputfield type (text or password)
  */

  function togglePasswordIcon(iconId, passwordInputfieldId) {
    let icon = document.getElementById(iconId);
    inputField = document.getElementById(passwordInputfieldId);

    if(icon.src.includes("unlock")) {
      inputField.type = "password";
      icon.src = "./img/lock.svg";
    } else {
      inputField.type = "text";
      icon.src = "./img/unlock.svg";
    }
  }

  /*
  ** function to toggle signup agreement checkbox
  */

  function toggleCheckbox(checkboxId) {
    const checkbox = document.getElementById(checkboxId);
    checkbox.dataset.checked = checkbox.dataset.checked == true ? false : true;
    
    if (checkbox.checked) {
      checkbox.style.backgroundColor = "#2a3647";
      checkbox.style.color = "white";
    } else {
      checkbox.style.backgroundColor = "";
      checkbox.style.color = "black";
    }
  }