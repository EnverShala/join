let subtasksArray;
let subtasksArrayPopup = [];
let pos;

/**
 * Adds drag-and-drop functionality to task cards and drop zones.
 *
 * - Makes elements with the class "taskCard" draggable.
 * - Sets up drop zones to allow dropping and provide visual feedback.
 * - Updates task levels and triggers necessary updates on drop.
 */
function addDragAndDropEvents() {
  const draggedCards = document.querySelectorAll(".taskCard");
  const dropZones = document.querySelectorAll(
    "#cardContainertoDo, #cardContainerinProgress, #cardContainerawaitingFeedback, #cardContainerdone"
  );

  draggedCards.forEach((card) => {
    card.ondragstart = (event) => {
      event.dataTransfer.setData("text", event.target.id);
    };
  });

  dropZones.forEach((zone) => {
    zone.ondragover = (event) => {
      event.preventDefault();
      event.currentTarget.style.border = "dotted 2px grey";
    };

    zone.ondragleave = (event) => {
      event.currentTarget.style.backgroundColor = "";
      event.currentTarget.style.border = "none";
    };

    zone.ondrop = (event) => {
      event.preventDefault();
      event.currentTarget.style.backgroundColor = "";
      const data = event.dataTransfer.getData("text");
      const card = document.getElementById(data);
      event.currentTarget.appendChild(card);

      event.currentTarget.style.border = "none";

      let newLevel = getNewDragAndDropContainerName(event.currentTarget.id);

      let taskNr = data.split("-")[1];

      tasks[taskNr].level = newLevel;

      editTask(tasks[taskNr].id, tasks[taskNr]);

      checkTaskLevels();
    };
  });
}

async function moveTaskUp(i) {
  if(tasks[i].level == "In Progress") {
    tasks[i].level = "To do";
  } else if(tasks[i].level == "Awaiting Feedback") {
    tasks[i].level = "In Progress";
  } else if(tasks[i].level == "Done") {
    tasks[i].level = "Awaiting Feedback";
  } else {
    return;
  }
  await editTask(tasks[i].id, tasks[i]);
  renderTaskCards();
}

async function moveTaskDown(i) {
  if(tasks[i].level == "Awaiting Feedback") {
    tasks[i].level = "Done";
  } else if(tasks[i].level == "In Progress") {
    tasks[i].level = "Awaiting Feedback";
  } else if(tasks[i].level == "To do") {
    tasks[i].level = "In Progress";
  } else {
    return;
  }
  await editTask(tasks[i].id, tasks[i]);
  renderTaskCards();
}

/**
 * Returns a user-friendly name for a drag-and-drop container based on its ID.
 *
 * @param {string} targetId The ID of the drag-and-drop container.
 * @returns {string} The user-friendly name of the container (e.g., "To do", "In Progress").
 */
function getNewDragAndDropContainerName(targetId) {
  if (targetId.includes("cardContainertoDo")) {
    return "To do";
  } else if (targetId.includes("cardContainerinProgress")) {
    return "In Progress";
  } else if (targetId.includes("cardContainerawaitingFeedback")) {
    return "Awaiting Feedback";
  } else if (targetId.includes("cardContainerdone")) {
    return "Done";
  }
}

/**
 * Checks the number of child elements in each task container (To Do, In Progress, Awaiting Feedback, Done)
 * and shows or hides corresponding "empty task" messages based on whether the containers are empty.
 */
function checkTaskLevels() {
  if (document.getElementById("cardContainertoDo").childElementCount == 0) {
    document.getElementById("emptyTaskTodo").classList.remove("d-none");
  } else {
    document.getElementById("emptyTaskTodo").classList.add("d-none");
  }

  if (
    document.getElementById("cardContainerinProgress").childElementCount == 0
  ) {
    document.getElementById("emptyTaskInProgress").classList.remove("d-none");
  } else {
    document.getElementById("emptyTaskInProgress").classList.add("d-none");
  }

  if (
    document.getElementById("cardContainerawaitingFeedback")
      .childElementCount == 0
  ) {
    document.getElementById("emptyTaskAwait").classList.remove("d-none");
  } else {
    document.getElementById("emptyTaskAwait").classList.add("d-none");
  }

  if (document.getElementById("cardContainerdone").childElementCount == 0) {
    document.getElementById("emptyTaskDone").classList.remove("d-none");
  } else {
    document.getElementById("emptyTaskDone").classList.add("d-none");
  }
}

/**
 * Adds a new subtask to the subtasks array and updates the displayed subtask list.
 */
function addNewSubtask() {
  let newSubtask = document.getElementById("addNewSubtaskInput").value.trim();

  if (newSubtask != "") {
    subtasksArray.push(newSubtask);
    renderSubtasks();
    document.getElementById("addNewSubtaskInput").value = "";
  }
}

/**
 * Deletes a subtask from the subtasks array at the specified position and re-renders the subtask list.
 *
 * @param {number} position The index of the subtask to delete in the subtasksArray.
 */
function deleteSubtask(position) {
  subtasksArray.splice(position, 1);

  renderSubtasks();
}

/**
 * Cancels the editing of a subtask at the specified position and reverts the list item back to its original display.
 *
 * @param {number} position The index of the subtask being edited.
 */
function cancelSubtaskEdit(position) {
  let listItem = document.querySelector(`ul li[data-index="${position}"]`);
  listItem.innerHTML = changeSubtaskInputFieldBackToListElement(
    position,
    subtasksArray[position]
  );
}

/**
 * Confirms the editing of a subtask at the specified position, updating the subtasks array and the displayed list item.
 * If the input is empty after trimming, the edit is canceled.
 *
 * @param {number} position The index of the subtask being edited.
 */
function confirmSubtaskEdit(position) {
  if (
    document.getElementById(`editSubtaskInput${position}`).value.trim() == ""
  ) {
    cancelSubtaskEdit(position);
    return;
  }

  let listItem = document.querySelector(`ul li[data-index="${position}"]`);

  subtasksArray[position] = document
    .getElementById(`editSubtaskInput${position}`)
    .value.trim();
  listItem.innerHTML = changeSubtaskInputFieldBackToListElement(
    position,
    subtasksArray[position]
  );
}

/**
 * Turns a subtask list item into an input field for editing.
 *
 * @param {number} position The index of the subtask to be edited.
 */
function editSubtask(position) {
  let listItem = document.querySelector(`ul li[data-index="${position}"]`);
  listItem.innerHTML = changeSubtaskContentToInputForEditTemplate(
    position,
    listItem.textContent.trim()
  );
}

/**
 * Renders the subtask list based on the current subtasksArray.
 */
function renderSubtasks() {
  let subtasksList = document.getElementById("subtaskList");

  if (subtasksArray == "") {
    subtasksList.innerHTML = "";
    return;
  }

  subtasksList.innerHTML = "";

  for (let j = 0; j < subtasksArray.length; j++) {
    subtasksList.innerHTML += createSubtaskListItemTemplate(
      j,
      subtasksArray[j]
    );
  }
}

/**
 * Toggles the "done" status of a subtask and updates the task data.
 *
 * @param {number} taskNr The index of the task in the tasks array.
 * @param {string} subtaskName The name of the subtask.
 * @param {number} checkBoxNr The number of the checkbox associated with the subtask.
 */
async function toggleSubtaskDone(taskNr, subtaskName, checkBoxNr) {
  if (
    document
      .getElementById(`subtaskCheckbox${checkBoxNr}`)
      .hasAttribute("checked")
  ) {
    if (tasks[taskNr].subtasksDone.includes(subtaskName)) {
      tasks[taskNr].subtasksDone = tasks[taskNr].subtasksDone.replace(
        subtaskName,
        ""
      );
      tasks[taskNr].subtasksDone = tasks[taskNr].subtasksDone.replace(
        "||",
        "|"
      );
      if (tasks[taskNr].subtasksDone.endsWith("|")) {
        tasks[taskNr].subtasksDone.slice(0, -1);
      }
      if (tasks[taskNr].subtasksDone[0] == "|") {
        tasks[taskNr].subtasksDone = tasks[taskNr].subtasksDone.slice(1);
      }
    }
    document
      .getElementById(`subtaskCheckbox${checkBoxNr}`)
      .removeAttribute("checked");
  } else {
    tasks[taskNr].subtasksDone += `${subtaskName}|`;
    document
      .getElementById(`subtaskCheckbox${checkBoxNr}`)
      .setAttribute("checked", true);
  }
  await editTask(currentId, tasks[taskNr]);
  await renderTaskCards();
}

/**
 * Toggles the checkboxes for assigned users based on the provided list.
 *
 * @param {string[]} assignedUsers An array of user names that are assigned to the task.
 * @param {string} [id=""] An optional ID to be included in the checkbox ID.
 */
function toggleAssignedUsers(assignedUsers, id = "") {
  for (let c = 0; c < users.length; c++) {
    for (let a = 0; a < assignedUsers.length; a++) {
      if (users[c].name == assignedUsers[a]) {
        toggleCheckbox(`AssignedContact${id}${c}`);
      }
    }
  }
}

/**
 * Handles keyboard events (Escape and Enter) for subtask editing and adding.
 *
 * @param {number} position The index of the subtask being edited, or -1 if adding a new subtask.
 */
function subtaskOnKeyDown(position) {
  if (position != -1) {
    if (event.key == "Escape") {
      cancelSubtaskEdit(position);
    }
    if (event.key == "Enter") {
      confirmSubtaskEdit(position);
    }
  } else {
    if (event.key == "Escape") {
      document.getElementById("addNewSubtaskInput").value = "";
    } // clear the add Subtask Input Field
    if (event.key == "Enter") {
      addNewSubtask();
    }
  }
}

/**
 * Handles keyboard events (Escape and Enter) for subtask editing and adding within a popup.
 *
 * @param {number} position The index of the subtask being edited, or -1 if adding a new subtask.
 */
function subtaskOnKeyDownPopup(position) {
  if (position != -1) {
    if (event.key == "Escape") {
      cancelSubtaskEditPopup(position);
    }
    if (event.key == "Enter") {
      confirmSubtaskEditPopup(position);
    }
  } else {
    if (event.key == "Escape") {
      document.getElementById("addSubtaskInputPopup").value = "";
    } // clear the add Subtask Input Field
    if (event.key == "Enter") {
      addSubtaskPopup();
    }
  }
}

/**
 * Populates the edit task popup form with the data of the currently selected task.
 */
function editPopupTask() {
  clearForm();

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == currentId) {
      document.getElementById("inputEdit").value = tasks[i].title;
      document.getElementById("inputDescription").value = tasks[i].description;
      document.getElementById("inputDueDate").value = tasks[i].date;
      subtasksArray = tasks[i].subtasks.split("|");
      let assignedArray = tasks[i].assigned.split(",");

      clearPrioButtons();
      activatePrioButton(tasks[i].priority);

      renderSubtasks();

      toggleAssignedUsers(assignedArray);
    }
  }
  document
    .getElementById("popupOnTaskSelectionMainContainerID")
    .classList.add("d-none");
  document.getElementById("editPopUpID").classList.remove("d-none");
}

/**
 * Activates the priority button corresponding to the given priority name.
 *
 * @param {string} prioName The name of the priority ("Urgent", "Medium", or "Low").
 * @param {string} [id=""] An optional ID to be included in the button ID.
 */
function activatePrioButton(prioName, id = "") {
  if (prioName == "Urgent") {
    clickOnUrgent(id);
  }
  if (prioName == "Medium") {
    clickOnMedium(id);
  }
  if (prioName == "Low") {
    clickOnLow(id);
  }
}

/**
 * Returns the index (task number) of the task with the current ID in the tasks array.
 *
 * @returns {number} The index of the task, or undefined if the task is not found.
 */
function getTaskNrFromCurrentId() {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == currentId) {
      return i;
    }
  }
}

/**
 * Retrieves the text content of all subtask list items and concatenates them into a string, separated by "|".
 *
 * @param {string} [id=""] An optional ID to append to the subtask list ID.
 * @returns {string} A string containing the text content of all subtask list items, separated by "|",
 *                   or an empty string if there are no list items.
 */
function getSubtaskItems(id = "") {
  let subtaskItems = document
    .getElementById("subtaskList" + id)
    .getElementsByTagName("li");
  let newSubtasks = "";

  if (subtaskItems.length > 0) {
    for (j = 0; j < subtaskItems.length; j++) {
      newSubtasks += subtaskItems[j].innerText + "|";
    }
  }

  newSubtasks = newSubtasks.slice(0, -1);

  return newSubtasks;
}

/**
 * Retrieves the names of the assigned users based on the checked checkboxes.
 *
 * @param {string} [id=""] An optional ID to include in the checkbox ID.
 * @returns {string} A string containing the names of the assigned users, separated by commas,
 *                   or an empty string if no users are assigned.
 */
function getAssignedUsers(id = "") {
  let newAssigned = "";

  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      let checkbox = document.getElementById(`AssignedContact${id}${i}`);

      if (checkbox.checked == true) {
        newAssigned += users[i].name + ",";
      }
    }
    newAssigned = newAssigned.slice(0, -1);
  }

  return newAssigned;
}

/**
 * Edits the currently selected task with the values from the edit form.
 */
async function editCurrentTask() {
  let newTitle = document.getElementById("inputEdit").value.trim();
  let newDescription = document.getElementById("inputDescription").value.trim();
  let newDate = document.getElementById("inputDueDate").value;
  let newPrio = getTaskPrio();
  let newAssigned = "";
  let newSubtasks = "";
  let currentTask = -1;

  currentTask = getTaskNrFromCurrentId();

  let oldLevel = tasks[currentTask].level;
  let oldCategory = tasks[currentTask].category;

  let subtasksDone = tasks[currentTask].subtasksDone;

  newSubtasks = getSubtaskItems();

  newAssigned = getAssignedUsers();

  let newTask = createTaskArray(
    newTitle,
    newDescription,
    newDate,
    oldCategory,
    newPrio,
    oldLevel,
    newSubtasks,
    newAssigned,
    subtasksDone
  );

  await editTask(currentId, newTask);
  await renderTaskCards();

  closeDialog();
}

/**
 * Creates a new task object.
 *
 * @param {string} newTitle The title of the task.
 * @param {string} newDescription The description of the task.
 * @param {string} newDate The due date of the task.
 * @param {string} oldCategory The category of the task.
 * @param {string} newPrio The priority of the task.
 * @param {string} oldLevel The level of the task.
 * @param {string} newSubtasks The subtasks of the task (as a string).
 * @param {string} newAssigned The assigned users of the task (as a string).
 * @param {string} [subtasksDone=""] The string of completed subtasks
 * @returns {object} A new task object.
 */
function createTaskArray(
  newTitle,
  newDescription,
  newDate,
  oldCategory,
  newPrio,
  oldLevel,
  newSubtasks,
  newAssigned
) {
  return {
    title: newTitle,
    description: newDescription,
    date: newDate,
    category: oldCategory,
    priority: newPrio,
    level: oldLevel,
    subtasks: newSubtasks,
    assigned: newAssigned,
  };
}

/**
 * Opens the task selection popup dialog.
 */
function openDialog() {
  setTimeout(() => {
    document.getElementById("popupOnTaskSelectionID").style.visibility =
      "visible";
  }, 100);
}

/**
 * Closes the task selection popup dialog and resets the main container visibility.
 */
function closeDialog() {
  document.getElementById("popupOnTaskSelectionID").style.visibility = "hidden";
  document.getElementById("editPopUpID").classList.add("d-none");

  setTimeout(() => {
    document
      .getElementById("popupOnTaskSelectionMainContainerID")
      .classList.remove("d-none");
  }, 250);
}

/**
 * Loads task data into the popup display elements.
 *
 * @param {number} taskNr The index of the task in the tasks array.
 * @param {string} contactEllipse HTML for the contact ellipse display.
 */
function loadPopupValueData(taskNr, contactEllipse) {
  document.getElementById("popUpUserStory").innerHTML = tasks[taskNr].category;
  document.getElementById("popupHeaderID").innerHTML = tasks[taskNr].title;
  document.getElementById("popupSpanID").innerHTML = tasks[taskNr].description;

  document.getElementById("dateId").textContent = tasks[taskNr].date;
  document.getElementById("prioId").textContent = tasks[taskNr].priority;
  document.getElementById("prioIdImg").src = `./img/${tasks[
    taskNr
  ].priority.toLowerCase()}.svg`;

  document.getElementById("popupContactEllipseID").innerHTML = contactEllipse;
}

/**
 * Populates the popup with task data, including subtasks and assigned user initials.
 *
 * @param {number} taskNr The index of the task in the tasks array.
 */
async function popupValueImplementFromTask(taskNr) {
  await loadTasks();

  subtasksArray = tasks[taskNr].subtasks.split("|");
  let contactEllipse = "";

  let assignedUsers = tasks[taskNr].assigned.split(",");

  while (assignedUsers.length > 0) {
    contactEllipse += `
    <div class="badgeImg initialsColor${await getUserColor(
      assignedUsers[0]
    )}">${getUserInitials(assignedUsers[0])}</div>`;
    assignedUsers.splice(0, 1);
  }

  loadPopupValueData(taskNr, contactEllipse);

  let valueFromName = document.getElementById("popupContactNameID");

  valueFromName.innerHTML = "";

  let assignedNames = tasks[taskNr].assigned.split(",");

  currentId = tasks[taskNr].id;

  for (let j = 0; j < assignedNames.length; j++) {
    valueFromName.innerHTML += `<div>${assignedNames[j]}</div>`;
  }

  let subtasksList = document.getElementById("showSubtasksContainer");
  subtasksList.innerHTML = "";

  for (let j = 0; j < subtasksArray.length; j++) {
    if (tasks[taskNr].subtasksDone.includes(subtasksArray[j])) {
      subtasksList.innerHTML += `<p class="subtasksP"><input type="checkbox" id="subtaskCheckbox${j}" onclick="toggleSubtaskDone(${taskNr}, '${subtasksArray[j]}', ${j})" checked>${subtasksArray[j]}<p>`;
    } else {
      subtasksList.innerHTML += `<p class="subtasksP"><input type="checkbox" id="subtaskCheckbox${j}" onclick="toggleSubtaskDone(${taskNr}, '${subtasksArray[j]}', ${j})">${subtasksArray[j]}<p>`;
    }
  }
}

/**
 * Retrieves a color index for a given user name.  Loads user data if necessary.
 * The color index is between 1 and 15 (inclusive).
 *
 * @param {string} userName The name of the user.
 * @returns {Promise<number>} A promise that resolves to the color index (1-15), or 1 if the user is not found.
 */
async function getUserColor(userName) {
  await loadUsers("/users");
  let returnColor = 1;

  for (let i = 0; i < users.length; i++) {
    if (users[i].name == userName) {
      returnColor = i + 1;
      while (returnColor > 15) {
        returnColor -= 15;
      }
      return returnColor;
    }
  }
  return returnColor;
}

/**
 * Returns the ID of a card container element based on its name.  Hides the corresponding "empty task" message.
 *
 * @param {string} cardContainerIdName The name of the card container ("To do", "In Progress", "Awaiting Feedback", or "Done").
 * @returns {string} The ID of the card container element, or an empty string if the name is invalid.
 */
function getCardContainerId(cardContainerIdName) {
  let result;

  switch (cardContainerIdName) {
    case "To do":
      result = "cardContainertoDo";
      document.getElementById("emptyTaskTodo").classList.add("d-none");
      break;
    case "In Progress":
      result = "cardContainerinProgress";
      document.getElementById("emptyTaskInProgress").classList.add("d-none");
      break;
    case "Awaiting Feedback":
      result = "cardContainerawaitingFeedback";
      document.getElementById("emptyTaskAwait").classList.add("d-none");
      break;
    case "Done":
      result = "cardContainerdone";
      document.getElementById("emptyTaskDone").classList.add("d-none");
      break;
    default:
      result = "";
      break;
  }

  return result;
}

/**
 * Renders the task cards based on the loaded tasks data.
 */
async function renderTaskCards() {
  await loadTasks("/tasks");

  clearCardContainersInnerHtml();

  for (let i = 0; i < tasks.length; i++) {
    const uniqueId = `taskCard-${i}`;
    let assignedUsers = tasks[i].assigned.split(",");
    let subTasksArray =
      tasks[i].subtasks.split("|") == "" ? [] : tasks[i].subtasks.split("|");
    let assignedUsersHTML = "";

    let cardContainerIdName = getCardContainerId(tasks[i].level);

    let counter = 0;
    let taskUsers = assignedUsers.length;

    while (assignedUsers.length > 0) {
      assignedUsersHTML += `<div class="badgeImg initialsColor${await getUserColor(
        assignedUsers[0]
      )}">${getUserInitials(assignedUsers[0])}</div>`;
      assignedUsers.splice(0, 1);
      counter++;

      if (counter == 4 && taskUsers > 4) {
        assignedUsersHTML += `<div class="badgeImg initialsColor0">+${
          taskUsers - counter
        }</div>`;
        break;
      }
    }

    document.getElementById(cardContainerIdName).innerHTML += taskCardTemplate(
      uniqueId,
      i,
      subTasksArray,
      assignedUsersHTML
    );
  }
  addDragAndDropEvents();
}

/**
 * Clears the inner HTML of all card container elements.
 */
function clearCardContainersInnerHtml() {
  document.getElementById("cardContainertoDo").innerHTML = "";
  document.getElementById("cardContainerinProgress").innerHTML = "";
  document.getElementById("cardContainerawaitingFeedback").innerHTML = "";
  document.getElementById("cardContainerdone").innerHTML = "";
}

/**
 * Adds a new subtask to the subtask list in the popup.
 */
function addSubtaskPopup() {
  let subtasksListPopup = document.getElementById("subtaskListPopup");
  let subtask = document.getElementById("addSubtaskInputPopup").value.trim();
  let listIndex = subtasksListPopup.getElementsByTagName("li").length;

  if (subtask == "") {
    return;
  }

  subtasksListPopup.innerHTML += createSubtaskListItemPopupTemplate(
    listIndex,
    subtask
  );

  subtasksArrayPopup.push(subtask);

  document.getElementById("addSubtaskInputPopup").value = "";
}

/**
 * Turns a subtask list item in the popup into an input field for editing.
 *
 * @param {number} position The index of the subtask to be edited.
 */
function editSubtaskPopup(position) {
  let listItem = document.querySelector(`ul li[data-index="${position}"]`);
  listItem.innerHTML = changeSubtaskContentToInputForEditPopupTemplate(
    position,
    listItem.textContent.trim()
  );
}

/**
 * Deletes a subtask from the subtask list in the popup at the specified position.
 *
 * @param {number} position The index of the subtask to delete.
 */
function deleteSubtaskPopup(position) {
  let subtasksListPopup = document.getElementById("subtaskListPopup");
  let listChild = subtasksListPopup.getElementsByTagName("li")[position];

  subtasksListPopup.removeChild(listChild);

  subtasksArrayPopup.splice(position, 1);
}

/**
 * Confirms the editing of a subtask in the popup at the specified position.
 *
 * @param {number} position The index of the subtask being edited.
 */
function confirmSubtaskEditPopup(position) {
  let subtasksListPopup = document.getElementById("subtaskListPopup");
  let subtask = document
    .getElementById(`editSubtaskInputPopup${position}`)
    .value.trim();

  subtasksListPopup.getElementsByTagName("li")[position].innerHTML =
    changeSubtaskInputFieldBackToListElementPopup(position, subtask);

  subtasksArrayPopup[position] = subtask;
}

/**
 * Cancels the editing of a subtask in the popup at the specified position.
 *
 * @param {number} position The index of the subtask being edited.
 */
function cancelSubtaskEditPopup(position) {
  let subtasksListPopup = document.getElementById("subtaskListPopup");

  subtasksListPopup.getElementsByTagName("li")[position].innerHTML =
    changeSubtaskInputFieldBackToListElementPopup(
      position,
      subtasksArrayPopup[position]
    );
}

/*
 ** AddTask Pop up modal opening / closing
 */
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("dialog[data-modal]");
  const openModalButton = document.getElementById("openModal");
  const closeModalButton = document.getElementById("closeModal");
  const alsoOpenButtons = document.querySelectorAll(".alsoOpenModal"); // Alle Elemente mit der Klasse "alsobtn"

  if (modal && openModalButton && closeModalButton) {
    // open modal
    openModalButton.addEventListener("click", () => {
      popupIdString = "Popup";
      modal.showModal();
      renderAssignedTo("Popup");
      activatePrioButton("Medium", "Popup");
      clearForm("Popup");
    });

    // close modal
    alsoOpenButtons.forEach((button) => {
      button.addEventListener("click", () => {
        popupIdString = "Popup";
        modal.showModal();
        renderAssignedTo("Popup");
        activatePrioButton("Medium", "Popup");
        clearForm("Popup");
      });
    });

    closeModalButton.addEventListener("click", () => {
      modal.close();
      popupIdString = "";
    });

    // closing the modal wenn clicking out of the modal
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.close();
        popupIdString = "";
      }
    });
  } else {
    console.error("Modal, Open Button, or Close Button not found in the DOM.");
  }
});

/**
 * Searches tasks based on the text entered in the search bar.
 * Hides tasks that don't match the search criteria.
 */
function searchTasks() {
  let searchBar = document.getElementById("searchBar").value;

  if (searchBar.trim().length > 2) {
    hideAllTaskCards();

    for (let i = 0; i < tasks.length; i++) {
      if (
        tasks[i].title.toLowerCase().includes(searchBar.toLowerCase()) ||
        tasks[i].description.includes(searchBar.toLowerCase())
      ) {
        showTaskCard(i);
      }
    }
  } else {
    showAllTaskCards();
  }
}

/**
 * Hides the task card at the specified index.
 *
 * @param {number} i The index of the task card to hide.
 */
function hideTaskCard(i) {
  document.getElementById(`taskCard-${i}`).classList.add("d-none");
}

/**
 * Shows the task card at the specified index.
 *
 * @param {number} i The index of the task card to show.
 */
function showTaskCard(i) {
  document.getElementById(`taskCard-${i}`).classList.remove("d-none");
}

/**
 * Hides all task cards.
 */
function hideAllTaskCards() {
  for (let i = 0; i < tasks.length; i++) {
    hideTaskCard(i);
  }
}

/**
 * Shows all task cards.
 */
function showAllTaskCards() {
  for (let i = 0; i < tasks.length; i++) {
    showTaskCard(i);
  }
}
