const FIREBASE_URL = "https://join-4d42f-default-rtdb.europe-west1.firebasedatabase.app/";
let users = [];
let tasks = [];
let accounts = [];
let login = [];
let currentUser = -1;
let currentId = -1;

/**
 * Initializes the index.html page by redirecting the user to the login page (login.html).
 */
function indexHtmlInit() {
  window.location.href = "login.html";
}

/**
 * Asynchronously loads user data from a Firebase database.
 * @param {string} [path="/users"] The path to the user data in the Firebase database.
 *                             Defaults to "/users".
 * @returns {Promise<void>} A Promise that resolves when the user data is loaded.
 *                           The loaded user data is stored in the global `users` array.
 */
async function loadUsers(path = "/users") {
  users = [];
  let userResponse = await fetch(FIREBASE_URL + path + ".json");
  let responseToJson = await userResponse.json();

  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      users.push({
        id: key,
        name: responseToJson[key]["name"],
        email: responseToJson[key]["email"],
        phone: responseToJson[key]["phone"],
      });
    });
    users.sort((a, b) => {
      return a.name.localeCompare(b.name); // sort users by name
    });
  }
}

/**
 * Asynchronously loads task data from a Firebase database.
 * @param {string} [path="/tasks"] The path to the task data in the Firebase database.
 *                             Defaults to "/tasks".
 * @returns {Promise<void>} A Promise that resolves when the task data is loaded.
 *                           The loaded task data is stored in the global `tasks` array.
 */
async function loadTasks(path = "/tasks") {
  tasks = [];
  let userResponse = await fetch(FIREBASE_URL + path + ".json");
  let responseToJson = await userResponse.json();

  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      tasks.push({
        id: key,
        title: responseToJson[key]["title"],
        description: responseToJson[key]["description"],
        date: responseToJson[key]["date"],
        category: responseToJson[key]["category"],
        priority: responseToJson[key]["priority"],
        level: responseToJson[key]["level"],
        subtasks: responseToJson[key]["subtasks"],
        assigned: responseToJson[key]["assigned"],
        subtasksDone: responseToJson[key]["subtasksDone"],
      });
    });
  }
}

/**
 * Asynchronously saves task data to a Firebase database using the POST method.
 * @param {string} [path=""] The path to save the task data in the Firebase database.
 *                         If empty, the data will be added to the root.
 * @param {object} [data={}] The task data to be saved.  Should be a JSON-serializable
 *                         object.
 * @returns {Promise<void>} A Promise that resolves when the data is successfully
 *                           saved.
 */
async function saveTasks(path = "", data = {}) {
  await fetch(FIREBASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Asynchronously edits an existing task in the Firebase database using the PUT method.
 * @param {string} id The ID of the task to be edited.
 * @param {object} [data={}] The updated task data. Should be a JSON-serializable object.
 * @returns {Promise<void>} A Promise that resolves when the task is successfully updated.
 */
async function editTask(id, data = {}) {
  await fetch(FIREBASE_URL + `/tasks/${id}` + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Asynchronously deletes a task from the Firebase database using the DELETE method.
 * If the provided ID is -1, the function does nothing and returns immediately.
 * After successful deletion, redirects the user to the "board.html" page.
 * @param {string|number} id The ID of the task to be deleted. Can be a string or a number.
 * @returns {Promise<void>} A Promise that resolves when the task is successfully deleted
 *                           or if the ID is -1.
 */
async function deleteTask(id) {
  if (id == -1) {
    return;
  }
  await fetch(FIREBASE_URL + `/tasks/${id}` + ".json", {
    method: "DELETE",
  });

  window.location.href = "board.html";
}

/**
 * Stores a user's email address in local storage to remember their account.
 * If the email is already stored, this function does nothing.  Emails are stored
 * as a comma-separated string.
 * @param {string} accountEmail The email address of the user account to remember.
 */
function rememberUserAccount(accountEmail) {
  let rememberedUsers = localStorage.getItem("remember");

  if (rememberedUsers) {
    if (!rememberedUsers.includes(accountEmail)) {
      let accountAsText = rememberedUsers + JSON.stringify(accountEmail);
      localStorage.setItem("remember", accountAsText);
    }
  } else {
    let accountAsText = JSON.stringify(accountEmail);
    localStorage.setItem("remember", accountAsText);
  }
}

/**
 * Checks if a given email address is valid based on a basic set of criteria.
 * This function performs a simple validation, checking for the presence of "@" and ".",
 * a minimum length, and ensuring that the TLD (top-level domain) is present and not
 * immediately preceded by an "@" symbol.  It is important to note that this
 * function does *not* perform full email address validation according to RFC standards.
 * For more robust validation, consider using a dedicated email validation library.
 *
 * @param {string} email The email address to validate.
 * @returns {boolean} True if the email is considered valid based on these criteria,
 *                    false otherwise.
 */
 function isEmailValid(email) {
  return (email.includes("@") &&
          email.includes(".") &&
          email.length >= 8 &&
          (email[email.length - 3] == "." || email[email.length - 4] == ".") &&
          (email[email.length - 4] != "@" && email[email.length - 5] != "@"));
}

/**
 * Asynchronously handles login input changes. Loads user accounts, checks
 * if the entered email is remembered, and enables/disables the login button
 * based on password length and email validity.
 * @returns {Promise<void>}
 */
async function loginOnInput() {
  await loadAccounts();
  let password = document.getElementById("userPassword").value;

  let rememberedAccounts = localStorage.getItem("remember");
  let email = document.getElementById("userEmail").value.trim();

  if (rememberedAccounts) {
    if (rememberedAccounts.includes(email)) {
      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].email == email) {
          document.getElementById("userPassword").value = accounts[i].password;
          document.getElementById("rememberMeButton").checked = true;
          document.getElementById("loginButton").disabled = false;
          return;
        }
      }
    }
  }

  if (password.length >= 6 && isEmailValid(email)) {
    document.getElementById("loginButton").disabled = false;
  } else {
    document.getElementById("loginButton").disabled = true;
  }
}

/**
 * Logs in a user by storing their email and username in local storage.
 * @param {string} accountEmail The email address of the logged-in user.
 */
function logInUserAccount(accountEmail) {
  let accountAsText = JSON.stringify(accountEmail);

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].email == accountEmail) {
      localStorage.setItem("username", accounts[i].name);
    }
  }

  localStorage.setItem("loggedInAccount", accountAsText);
}

/**
 * Logs out the current user by clearing their email and username from local storage.
 */
function logOutUserAccount() {
  localStorage.setItem("loggedInAccount", "");
  localStorage.setItem("username", "");
}

/**
 * Retrieves the email address of the logged-in user from local storage.
 * @returns {string|null} The email address of the logged-in user, or `null` if no user is logged in.
 */
function getLoggedInUser() {
  let loggedInUserAsText = localStorage.getItem("loggedInAccount");

  if (loggedInUserAsText) {
    return JSON.parse(loggedInUserAsText);
  }

  return "";
}

/**
 * Asynchronously handles user login. Loads user accounts, checks credentials,
 * remembers the user if requested, logs the user in, and displays messages
 * based on the login result.
 * @returns {Promise<void>}
 */
async function loginUser() {
  let userEmail = document.getElementById("userEmail").value.trim();
  let userPassword = document.getElementById("userPassword").value;
  let rememberedAccounts = localStorage.getItem("remember");

  await loadAccounts();

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].email == userEmail) {
      if (accounts[i].password == userPassword) {
        if (document.getElementById("rememberMeButton").checked) {
          rememberUserAccount(userEmail);
        } else {
          if(rememberedAccounts.includes(userEmail)) {
            rememberedAccounts = rememberedAccounts.replace(`"${userEmail}"`, "");

            localStorage.setItem("remember", rememberedAccounts);
          }
        }
        logInUserAccount(userEmail);
        showLoginMessage("Login erfolgreich!", 1);
        return;
      } else {
        showLoginMessage("Login fehlgeschlagen!", 0);
        return;
      }
    }
  }

  showLoginMessage("Zu dieser E-Mail existiert kein Account!", 0);
}

/**
 * Asynchronously handles user sign-up. Checks for existing accounts with the
 * given email, and if no account exists, creates a new account in the Firebase
 * database.
 * @param {object} [data={}] The user data for the new account. Should be a
 *                           JSON-serializable object containing at least 'email'
 *                           and 'password' properties.
 * @returns {Promise<void>}
 */
async function signUpUser(data = {}) {
  let stopSignUp = false;
  await loadAccounts();

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].email == data.email) {
      alert("Zu dieser E-Mail-Adresse besteht bereits ein Account. Passwort vergessen? Selber schuld!");
      stopSignUp = true;
    }
  }

  if (stopSignUp == false) {
    await fetch(FIREBASE_URL + "/accounts" + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
}

/**
 * Asynchronously loads user account data from a Firebase database.
 * The loaded account data is stored in the global `accounts` array.
 * @returns {Promise<void>} A Promise that resolves when the account data is loaded.
 */
async function loadAccounts() {
  accounts = [];
  let userResponse = await fetch(FIREBASE_URL + "/accounts" + ".json");
  let responseToJson = await userResponse.json();

  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      accounts.push({
        id: key,
        name: responseToJson[key]["name"],
        email: responseToJson[key]["email"],
        password: responseToJson[key]["password"],
      });
    });
  }
}

/**
 * Loads and displays the user's initials in the header profile icon.
 * If no username is found in local storage, displays "Guest" initials.
 */
function loadAccountInitials() {
  let accountName = localStorage.getItem("username");
  accountName = accountName == "" ? "Guest" : accountName;
  document.getElementById("header-profile-icon").innerHTML = getUserInitials(accountName);
}

/**
 * Asynchronously registers a new user. Retrieves user input, creates a user
 * data object, checks sign-up conditions, and then calls the `signUpUser`
 * function to create the account.  Redirects to the login page upon
 * successful registration.  Displays an alert if sign-up conditions are not met.
 * @returns {Promise<void>}
 */
async function registerUser() {
  let name = document.getElementById("fullName").value.trim();
  let email = document.getElementById("userEmail").value.trim();
  let password = document.getElementById("userPassword").value;

  let loginData = {
    name: name,
    email: email,
    password: password,
  };

  if (checkSignUpConditions()) {
    await signUpUser(loginData);
    window.location.href = "login.html";
  } else {
    alert("Please enter the required informations & accept the privacy policy.");
  }
}

/**
 * Asynchronously adds a new user. Retrieves user input from the form,
 * creates a user object, clears the form fields, saves the user data using
 * the `postData` function, and re-renders the contact list.
 * @returns {Promise<void>}
 */
async function addUser() {
  let nameValue = document.getElementById("name").value;
  let phoneValue = document.getElementById("phone").value;
  let emailValue = document.getElementById("email").value;
  let newUser = { name: nameValue, email: emailValue, phone: phoneValue };
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("email").value = "";
  await postData("/users", newUser);
  await renderContacts();
}

/**
 * Asynchronously posts data to a specified path in the Firebase database using the POST method.
 * @param {string} [path=""] The path in the Firebase database to post the data to.
 *                         If empty, the data will be added to the root.
 * @param {object} [data={}] The data to be posted. Must be a JSON-serializable object.
 * @returns {Promise<void>} A Promise that resolves when the data is successfully posted.
 */
async function postData(path = "", data = {}) {
  await fetch(FIREBASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Asynchronously deletes a user and updates associated tasks.
 * Loads all tasks, finds tasks assigned to the user to be deleted,
 * removes the user's name from the assigned list for those tasks,
 * updates the tasks in the database, and finally deletes the user.
 * Re-renders the contact list and updates user information display.
 * @param {string} id The ID of the user to delete.
 * @returns {Promise<void>}
 */
async function deleteUser(id) {
  await loadTasks("/tasks");

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == id) {
      for (let j = 0; j < tasks.length; j++) {
        if (tasks[j].assigned.includes(users[i].name)) {
          tasks[j].assigned = tasks[j].assigned.replace(users[i].name, "");
          tasks[j].assigned = tasks[j].assigned.replace(",,", ",");
          if (tasks[j].assigned[tasks[j].assigned.length - 1] == ",") {
            tasks[j].assigned = tasks[j].assigned.slice(0, -1);
          }
          await editTask(tasks[j].id, tasks[j]);
        }
      }
    }
  }

  await fetch(FIREBASE_URL + `/users/${id}` + ".json", {
    method: "DELETE",
  });

  await renderContacts();
  loadUserInformation(-1);
}

/**
 * Asynchronously edits an existing user. Retrieves updated user data from the
 * form, updates the user data object, saves the changes to the Firebase database
 * using the PUT method, re-renders the contact list, updates the displayed user
 * information, and closes the edit popup.
 * @param {string} id The ID of the user to edit.
 * @param {object} [data={}] The current user data.  This object will be modified
 *                           by the function.
 * @returns {Promise<void>}
 */
async function editUser(id, data = {}) {
  data.name = document.getElementById("name").value;
  data.email = document.getElementById("email").value;
  data.phone = document.getElementById("phone").value;

  await fetch(FIREBASE_URL + `/users/${id}` + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  await renderContacts();
  loadUserInformation(currentUser);
  closePopup();
}

/**
 * Retrieves the ID of a user based on their email address.
 * @param {string} email The email address of the user.
 * @returns {string|number} The ID of the user if found, or -1 if the user is not found.
 */
function getUserId(email) {
  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].email == email) {
        return users[i].id;
      }
    }
  } else {
    return -1; // Default Value -1 means User not found
  }
}

/**
 * Asynchronously renders the contact list. Loads user data, groups contacts
 * by the first letter of their name, and generates the HTML for the contact list.
 * The `contactTemplate` function is assumed to be defined elsewhere and generates
 * the HTML for individual contacts.  After rendering, calls `removeHover` to
 * presumably remove any hover effects from the previous rendering.
 * @returns {Promise<void>}
 */
async function renderContacts() {
  let html = "";
  let firstLetter = "0";
  let j = 1;

  await loadUsers("/users");

  for (let i = 0; i < users.length; i++) {
    if (users[i].name[0].toUpperCase() != firstLetter.toUpperCase()) {
      html += `<div class="contacts-first-letter-container"><span id="firstLetterOfContactName" class="contacts-first-letter">${users[
        i
      ].name[0].toUpperCase()}</span></div>
              <div class="border-container"> <div class="border"></div></div>`;

      firstLetter = users[i].name[0].toUpperCase();
    }

    html += contactTemplate(i, j);

    j++;
    if (j > 15) {
      j = 1;
    }
  }

  document.getElementById("contact-list").innerHTML = html;
  removeHover();
}

/**
 * Generates user initials from a username.
 * If the username contains multiple words, the initials are formed from the first
 * letter of the first and last words.  If the username contains only one word,
 * the initial is the first letter of that word.
 * @param {string} username The username to generate initials from.
 * @returns {string} The user initials.
 */
function getUserInitials(username) {
  let result = username
    .trim()
    .split(" ")
    .map((wort) => wort[0].toUpperCase());

  if (username.split(" ").length > 1) {
    result = result[0] + result[result.length - 1];
  } else {
    result = result[0];
  }
  return result;
}

/**
 * Loads user info into the UI or clears it if id is -1.
 * @async
 * @param {number} id - User ID (-1 to clear).
 */
async function loadUserInformation(id) {
  document.getElementById("contact-name").innerHTML = id == -1 ? "" : users[id].name;
  document.getElementById("contact-email").innerHTML = id == -1 ? "" : users[id].email;
  document.getElementById("contact-phone").innerHTML = id == -1 ? "" : users[id].phone;
  document.getElementById("ellipse").innerHTML = id == -1 ? "" : getUserInitials(users[id].name);

  if (id == -1) {
    document.getElementById("display-contactID").classList.add("d-none");
  } else {
    document.getElementById("display-contactID").classList.remove("d-none");

    let userEllipseColor = document.getElementById(`userColor${id}`).className.split(" ")[1];

    document.getElementById("ellipse").className = `ellipse ${userEllipseColor}`;

    highlightUser(id);
  }
  currentUser = id;
}

/**
 * Hides the contacts list and shows the back arrow in responsive mode (screen width <= 799px).
 */
function hideContactsListInResponsiveMode() {
  if (window.innerWidth <= 799) {
    document.getElementById("contact-list").classList.add("d-none");
    document.getElementById("add-contact-containerID").style.display = "none";
    document.getElementById("back-arrow-on-responsiveID").classList.remove("d-none");
    showContactsInDetailInResponsiveMode();
  }
}

/**
 * Adjusts the UI when the window is resized. Shows the contact list and related elements
 * for screens >= 800px, otherwise hides them in responsive mode.
 */
window.onresize = function showContactListOnExitResponsiveMode() {
  if (window.innerWidth >= 800) {
    document.getElementById("display-contact-headerID").style.display = "flex";
    document.getElementById("display-contactID").style.display = "block";
    document.getElementById("add-contact-containerID").style.display = "flex";
    document.getElementById("contact-list").classList.remove("d-none");
    document.getElementById("back-arrow-on-responsiveID").classList.add("d-none");
  }
  else if (hideContactsListInResponsiveMode()) {
    hideContactsListInResponsiveMode();
  }
}


/**
 * Displays the contact details section in responsive mode by setting the appropriate styles.
 */
function showContactsInDetailInResponsiveMode() {
  document.getElementById("display-contact-headerID").style.display = "flex";
  document.getElementById("display-contactID").style.display = "flex";
}

/**
 * Shows the contact list and hides the contact details in responsive mode (screen width < 800px).
 */
function showContactListAgainInResponsiveMode() {
  if (window.innerWidth < 800) {
    document.getElementById("display-contact-headerID").style.display = "none";
    document.getElementById("display-contactID").style.display = "none";
    document.getElementById("contact-list").classList.remove("d-none");
    document.getElementById("add-contact-containerID").style.display = "flex";
    document.getElementById("back-arrow-on-responsiveID").classList.add("d-none");
  }
}

/**
 * Adds a background color class to highlight the selected user.
 * @param {number} id - The ID of the selected user (unused in the function).
 */
function changeBgOnSelectedUser(id) {
  document.getElementById("contact-containerID").classList.add("selected-user-color");
}

/**
 * Initializes the contacts by rendering them and resetting the user information display.
 * @async
 */
async function initContacts() {
  await renderContacts();
  loadUserInformation(-1);
}

/**
 * Highlights a user in the contact list. Removes the highlight from all other
 * users and adds the highlight to the specified user.
 * @param {number} userIndex The index of the user to highlight.
 */
function highlightUser(userIndex) {
  for (let i = 0; i < users.length; i++) {
    document.getElementById(`user-container${i}`).classList.remove("highlightUser");
  }
  document.getElementById(`user-container${userIndex}`).classList.add("highlightUser");
}

/**
 * Adds a click event listener to each contact container element.
 * When a contact container is clicked, it removes the "contact-container-no-hover"
 * class from any other contact container that has it and then adds the class to
 * the clicked container. This effectively prevents hover effects on the
 * currently selected contact.
 */
function removeHover() {
  document.querySelectorAll(".contact-container").forEach(selContact =>
    selContact.addEventListener("click", () => {
        document.querySelector(".contact-container-no-hover")?.classList.remove("contact-container-no-hover"); 
        selContact.classList.add("contact-container-no-hover");
    })
);
}
