/**
 * Öffnet das Pop-up-Fenster und lädt den Inhalt von addContacts.html.
 */
function addNewUser() {
  fetch("addContacts.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("popup-body").innerHTML = data;
      document.getElementById("popup").style.display = "block";
    });
}

/**
 * Schließt das Pop-up-Fenster.
 */
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

/**
 * Öffnet das Pop-up-Fenster und lädt den Inhalt von addContacts.html.
 */
function addNewUser() {
  fetch("addContacts.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("popup-body").innerHTML = data;
      document.getElementById("popup").style.display = "block";
    });
}

/**
 * Öffnet das Pop-up-Fenster und lädt den Inhalt von editContacts.html.
 */
function editUserPopup() {
  fetch("editContacts.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("popup-body").innerHTML = data;
      document.getElementById("popup").style.display = "block";

      document.getElementById("name").value = users[currentUser].name;
      document.getElementById("email").value = users[currentUser].email;
      document.getElementById("phone").value = users[currentUser].phone;
    });
}

/**
 * Schließt das Pop-up-Fenster.
 */
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

async function addUserButton() {
  await addUser();
  closePopup();
}
