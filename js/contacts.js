/**
 * opens popup window and loads content of addContacts.html.
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
 * closes popup window
 */
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

/**
 * opens popup window and loads content of editContacts.html.
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
 * adds user and closes popup 
 */
async function addUserButton() {
  await addUser();
  closePopup();
}