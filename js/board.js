let subtasksArray;
let pos;

/*
** Funktion zum Hinzufügen der Drag-and-Drop-Events
*/

function addDragAndDropEvents() {
  const draggedCards = document.querySelectorAll(".taskCard");
  const dropZones = document.querySelectorAll(
    "#cardContainertoDo, #cardContainerinProgress, #cardContainerawaitingFeedback, #cardContainerdone"
  );

  // Die ID des zu ziehenden Elements wird in den Datenübertragungsobjekt gespeichert
  draggedCards.forEach((card) => {
    card.ondragstart = (event) => { event.dataTransfer.setData("text", event.target.id); };
  });

  //event.currentTarget.style.backgroundColor = "#1FD7C1";
  dropZones.forEach((zone) => {
      zone.ondragover = (event) => {
        event.preventDefault();
        event.currentTarget.style.border = "dotted 2px grey";
    };

    zone.ondragleave = (event) => {
      event.currentTarget.style.backgroundColor = ""; // Zurücksetzen des Hintergrunds
      event.currentTarget.style.border = "none";
    };

    zone.ondrop = (event) => {
      event.preventDefault();
      event.currentTarget.style.backgroundColor = ""; // Zurücksetzen des Hintergrunds
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

/*
** returns the Name of the new Drag and Drop Container when dropping
*/

function getNewDragAndDropContainerName(targetId) {
  if (targetId.includes("cardContainertoDo")) { return "To do"; }
  else if (targetId.includes("cardContainerinProgress")) { return "In Progress"; }
  else if (targetId.includes("cardContainerawaitingFeedback")) { return "Awaiting Feedback"; }
  else if (targetId.includes("cardContainerdone")) { return "Done"; }
}

/*
** checks if a task card is in the container or not, if not, show "no tasks" information into container
*/

function checkTaskLevels() {
  if (document.getElementById("cardContainertoDo").childElementCount == 0) {
    document.getElementById("emptyTaskTodo").classList.remove("d-none");
  } else {
    document.getElementById("emptyTaskTodo").classList.add("d-none");
  }

  if (document.getElementById("cardContainerinProgress").childElementCount == 0) {
    document.getElementById("emptyTaskInProgress").classList.remove("d-none");
  } else {
    document.getElementById("emptyTaskInProgress").classList.add("d-none");
  }

  if (document.getElementById("cardContainerawaitingFeedback").childElementCount == 0) {
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

/*
** adds a new subtask (and renders the subtasks then)
*/

function addNewSubtask() {
  let newSubtask = document.getElementById("addNewSubtaskInput").value.trim();

  if(newSubtask != "") {
    subtasksArray.push(newSubtask);
    renderSubtasks();
    document.getElementById("addNewSubtaskInput").value = "";
  }
}


/*
** deletes the subtask and renders the subtasks again
*/

function deleteSubtask(position) {
  subtasksArray.splice(position, 1);

  renderSubtasks();
}


/*
** cancels the subtask edit, and changes the subtask editing input field back to a list element
*/


function cancelSubtaskEdit(position) {
  let listItem = document.querySelector(`ul li[data-index="${position}"]`);
  listItem.innerHTML = changeSubtaskInputFieldBackToListElement(position, subtasksArray[position]);
}


/*
** confirms the subtask edit, saves the new subtask into the array, and changes the subtask editing input field back to a list element
*/


function confirmSubtaskEdit(position) {
  if(document.getElementById(`editSubtaskInput${position}`).value.trim() == "") { cancelSubtaskEdit(position); return; }

  let listItem = document.querySelector(`ul li[data-index="${position}"]`);

  subtasksArray[position] = document.getElementById(`editSubtaskInput${position}`).value.trim();
  listItem.innerHTML = changeSubtaskInputFieldBackToListElement(position, subtasksArray[position]);
}

/*
** changes the subtask from a list element into an input field for editing
*/


function editSubtask(position) {
  let listItem = document.querySelector(`ul li[data-index="${position}"]`);
  listItem.innerHTML = changeSubtaskContentToInputForEditTemplate(position, listItem.textContent.trim());
}

/*
** renders the subtasks intro the ul list
*/

function renderSubtasks() {
  let subtasksList = document.getElementById("subtaskList");
  subtasksList.innerHTML = "";
  
  for (let j = 0; j < subtasksArray.length; j++) {
    subtasksList.innerHTML += createSubtaskListItemTemplate(j, subtasksArray[j]);
  }
}

/*
** toggles the checkboxes of the assignedusers in the assigneduser menu
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

/*
** function for onkeydown (using enter to confirm or escape to clear) on subtask editing on edit task page:
*/

function subtaskOnKeyDown(position) {
  if(position != -1) {
    if(event.key == "Escape") { cancelSubtaskEdit(position); }
    if(event.key == "Enter") { confirmSubtaskEdit(position); }
  } else {
    if(event.key == "Escape") { document.getElementById("addNewSubtaskInput").value = ""; } // clear the add Subtask Input Field
    if(event.key == "Enter") { addNewSubtask(); }
  }
}

/*
** load task information into the edit task form
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
  document.getElementById("popupOnTaskSelectionMainContainerID").classList.add("d-none");
  document.getElementById("editPopUpID").classList.remove("d-none");
}

/*
** activates the selected prio button
*/

function activatePrioButton(prioName, id = "") {
  if (prioName == "Urgent") { clickOnUrgent(id); }
  if (prioName == "Medium") { clickOnMedium(id); }
  if (prioName == "Low") { clickOnLow(id); }
}

/*
** returns the current task nr through comparing all tasks with the current task ID
*/


function getTaskNrFromCurrentId() {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == currentId) {
      return i;
    }
  }
}

/*
** gets/reads the subtasks from the UL list (to save them into the task then)
*/

function getSubtaskItems(id = "") {
  let subtaskItems = document.getElementById("subtaskList" + id).getElementsByTagName("li");
  let newSubtasks = "";

  if (subtaskItems.length > 0) {
    for (j = 0; j < subtaskItems.length; j++) {
      newSubtasks += subtaskItems[j].innerText + "|";
    }
  }

  newSubtasks = newSubtasks.slice(0, -1);

  return newSubtasks;
}

/*
** returns the assigned Users (as a String)
*/

function getAssignedUsers(id = "") {
  let newAssigned = "";

  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      let checkbox = document.getElementById(`AssignedContact${id}${i}`);

      if(checkbox.checked == true) {
        newAssigned += users[i].name + ",";
      }
    }
    newAssigned = newAssigned.slice(0, -1);
  }

  return newAssigned;
}

/*
** edits the current/opened Task
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

  newSubtasks = getSubtaskItems();

  newAssigned = getAssignedUsers();

  let newTask = createTaskArray(newTitle, newDescription, newDate, oldCategory, newPrio, oldLevel, newSubtasks, newAssigned);

  await editTask(currentId, newTask);
  await renderTaskCards();

  closeDialog();
}

/*
** creates an array with the task informations
*/

function createTaskArray(newTitle, newDescription, newDate, oldCategory, newPrio, oldLevel, newSubtasks, newAssigned) {
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

/*
** make edit task popup visible, timeout so the dialog will be showed after its fully loaded
*/

function openDialog() {
  setTimeout(() => {
    document.getElementById("popupOnTaskSelectionID").style.visibility = "visible";
  }, 100);
}

/*
** make edit task popup invisible, time out to hide the closing dialogs
*/

function closeDialog() {
  document.getElementById("popupOnTaskSelectionID").style.visibility = "hidden";
  document.getElementById('editPopUpID').classList.add('d-none');
  
  setTimeout(() => { document.getElementById('popupOnTaskSelectionMainContainerID').classList.remove('d-none')
  }, 250);
}

/*
** shows data in card container popup
*/

function loadPopupValueData(taskNr, contactEllipse) {
  document.getElementById("popUpUserStory").innerHTML = tasks[taskNr].category;
  document.getElementById("popupHeaderID").innerHTML = tasks[taskNr].title;
  document.getElementById("popupSpanID").innerHTML = tasks[taskNr].description;

  document.getElementById("dateId").textContent = tasks[taskNr].date;
  document.getElementById("prioId").textContent = tasks[taskNr].priority;
  document.getElementById("prioIdImg").src = `./img/${tasks[taskNr].priority.toLowerCase()}.svg`;

  document.getElementById("popupContactEllipseID").innerHTML = contactEllipse;
}

/*
** load task values into the task popup
*/

async function popupValueImplementFromTask(taskNr) {
  await loadTasks();

  subtasksArray = tasks[taskNr].subtasks.split("|");
  let contactEllipse = "";
  
  let assignedUsers = tasks[taskNr].assigned.split(",");

  while (assignedUsers.length > 0) {
    contactEllipse += `
    <div class="badgeImg initialsColor${await getUserColor(assignedUsers[0])}">${getUserInitials(assignedUsers[0])}</div>`;
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
    subtasksList.innerHTML += `<p class="subtasksP">${subtasksArray[j]}<p>`;
  }
}

/*
** get user color rotating from 1-15
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


/*
** function returns id name of card containers from task level
** also if a card container gets its first card the "no task ..." gets hidden
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

/*
** render task cards into board
*/

async function renderTaskCards() {
  await loadTasks("/tasks");

  clearCardContainersInnerHtml();

  for (let i = 0; i < tasks.length; i++) {
    const uniqueId = `taskCard-${i}`;
    let assignedUsers = tasks[i].assigned.split(",");
    let subTasksArray = tasks[i].subtasks.split("|");
    let assignedUsersHTML = "";

    let cardContainerIdName = getCardContainerId(tasks[i].level);

    let counter = 0;
    let taskUsers = assignedUsers.length;

    while (assignedUsers.length > 0) {
      assignedUsersHTML += `<div class="badgeImg initialsColor${await getUserColor(assignedUsers[0])}">${getUserInitials(assignedUsers[0])}</div>`;
      assignedUsers.splice(0, 1);
      counter++;

      if(counter == 4 && taskUsers > 4) {
        assignedUsersHTML += `<div class="badgeImg initialsColor0">+${taskUsers - counter}</div>`;
        break;
      }
    }

    document.getElementById(cardContainerIdName).innerHTML += taskCardTemplate(uniqueId, i, subTasksArray, assignedUsersHTML);
  }
  // Drag-and-Drop-Events nach dem Rendern der Karten hinzufügen
  addDragAndDropEvents();
}

/*
** clears the innerHTML of all card containers
*/

function clearCardContainersInnerHtml() {
  document.getElementById("cardContainertoDo").innerHTML = "";
  document.getElementById("cardContainerinProgress").innerHTML = "";
  document.getElementById("cardContainerawaitingFeedback").innerHTML = "";
  document.getElementById("cardContainerdone").innerHTML = "";  
}


function addSubtaskPopup() {
  alert("yo");

  let subtasksListPopup = document.getElementById("subtaskListPopup");
  let subtask = document.getElementById("addSubtaskInputPopup").value.trim();
  
  subtasksListPopup.innerHTML += createSubtaskListItemTemplate(0, subtask);

  document.getElementById("addSubtaskInputPopup").value = "";
}

/*
** AddTask Pop up
*/

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("dialog[data-modal]");
  const openModalButton = document.getElementById("openModal");
  const closeModalButton = document.getElementById("closeModal");
  const alsoOpenButtons = document.querySelectorAll(".alsoOpenModal"); // Alle Elemente mit der Klasse "alsobtn"

  if (modal && openModalButton && closeModalButton) {
    // Modal öffnen
    openModalButton.addEventListener("click", () => {
      popupIdString = "Popup";
      modal.showModal();
      renderAssignedTo('Popup');
      activatePrioButton("Medium", "Popup");
    });

    alsoOpenButtons.forEach((button) => {
      button.addEventListener("click", () => {
        popupIdString = "Popup";
        modal.showModal();
        renderAssignedTo('Popup');
        activatePrioButton("Medium", "Popup");
      });
    });

    // Modal schließen
    closeModalButton.addEventListener("click", () => { modal.close(); popupIdString = ""; clearForm("Popup"); });

    // Optional: Modal schließen, wenn man außerhalb des Modals klickt
    modal.addEventListener("click", (event) => {
      if (event.target === modal) { modal.close(); popupIdString = ""; clearForm("Popup"); }
    });
  } else {
    console.error("Modal, Open Button, or Close Button not found in the DOM.");
  }
});

/*
** search tasks function, only matches are visible, rest hidden
*/

function searchTasks() {
  let searchBar = document.getElementById("searchBar");

  if(searchBar.value.length > 0) {
    hideAllTaskCards();

    for(let i = 0; i < tasks.length; i++) {
      if(tasks[i].title.includes(searchBar.value) || tasks[i].description.includes(searchBar.value)) {
        showTaskCard(i);
      }
    }
  } else {
    showAllTaskCards();
  }
}

/*
** hide single task card
*/

function hideTaskCard(i) {
  document.getElementById(`taskCard-${i}`).classList.add("d-none");
}

/*
** show single task card
*/

function showTaskCard(i) {
  document.getElementById(`taskCard-${i}`).classList.remove("d-none");
}

/*
** hide all task cards
*/

function hideAllTaskCards() {
  for(let i = 0; i < tasks.length; i++) {
    hideTaskCard(i);
  }
}

/*
** show all task cards
*/

function showAllTaskCards() {
  for(let i = 0; i < tasks.length; i++) {
    showTaskCard(i);
  }
}