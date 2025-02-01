let popupIdString = "";

/**
 * Asynchronously creates a new task. Retrieves task details from the form,
 * including title, description, due date, category, priority, subtasks, and
 * assigned users.  Saves the new task to the Firebase database using the
 * `saveTasks` function, displays a success message, and clears the form.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different task forms (e.g., in a modal or popup).
 * @returns {Promise<void>}
 */
async function createTask(id = "") {
  let taskTitle = document.getElementById("title").value;
  let taskDescription = document.getElementById("description").value;
  let taskDate = document.getElementById("due-date-input").value;
  let taskCategory = document.getElementById("category-displayed").textContent.trim();

  let taskPrio = getTaskPrio(id);

  let taskSubtasks = "";
  let assignedTo = "";

  let subtaskItems = document.getElementById("subtaskList" + id).children;

  if (subtaskItems.length > 0) {
    for (let i = 0; i < subtaskItems.length; i++) {
      taskSubtasks += subtaskItems[i].textContent.trim() + "|";
    }
    taskSubtasks = taskSubtasks.slice(0, -1);
  }

  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      let checkbox = document.getElementById(`AssignedContact${id}${i}`);

      if (checkbox.checked == true) {
        assignedTo += users[i].name + ",";
      }
    }
    assignedTo = assignedTo.slice(0, -1);
  }

  let newTask = createTaskArray(taskTitle, taskDescription, taskDate, taskCategory, taskPrio, "To do", taskSubtasks, assignedTo);

  saveTasks("/tasks", newTask);

  showSuccessMessage();

  clearForm(id);
}

/**
 * Creates a new task object with the provided details.
 * @param {string} newTitle The title of the new task.
 * @param {string} newDescription The description of the new task.
 * @param {string} newDate The due date of the new task.
 * @param {string} oldCategory The category of the new task.
 * @param {string} newPrio The priority of the new task.
 * @param {string} oldLevel The level of the new task.
 * @param {string} newSubtasks The subtasks of the new task (e.g., comma-separated).
 * @param {string} newAssigned The users assigned to the task (e.g., comma-separated).
 * @returns {object} A new task object.
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
    subtasksDone: "",
  };
}

/**
 * Determines the priority of a task based on the active priority button.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different task forms.
 * @returns {string} The priority of the task ("Urgent", "Medium", "Low", or "None").
 */
function getTaskPrio(id = "") {
  if (document.getElementById("urgent" + id).className.includes("btn-bg-change-urgent-onclick")) {
    return "Urgent";
  }
  if (document.getElementById("medium" + id).className.includes("btn-bg-change-medium-onclick")) {
    return "Medium";
  }
  if (document.getElementById("low" + id).className.includes("btn-bg-change-low-onclick")) {
    return "Low";
  }
  return "None";
}

/**
 * Clears the styling of all priority buttons, resetting them to their default state.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different sets of priority buttons.
 */
function clearPrioButtons(id = "")
{
  document.getElementById('urgent' + id).className = "btn-prio";
  document.getElementById('urgent-whiteID' + id).className ="d-none";
  document.getElementById('urgentID' + id).className ="";
  document.getElementById('urgent' + id).style.boxShadow = "";

  document.getElementById('medium' + id).className = "btn-prio";
  document.getElementById('medium-whiteID' + id).className ="d-none";
  document.getElementById('mediumID' + id).className ="";
  document.getElementById('medium' + id).style.boxShadow = "";

  document.getElementById('low' + id).className = "btn-prio";
  document.getElementById('low-whiteID' + id).className ="d-none";
  document.getElementById('lowID' + id).className ="";
  document.getElementById('low' + id).style.boxShadow = "";
}

/**
 * Handles a click event on the "Urgent" priority button. If "Urgent" is already
 * selected, deselects it. Otherwise, deselects all other priority buttons and
 * selects "Urgent".
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different sets of priority buttons.
 */
function clickOnUrgent(id = "") {
  if (getTaskPrio(id) == "Urgent") {
    clearPrioButtons(id);
    return;
  }

  clearPrioButtons(id);

  document.getElementById("urgent" + id).className = "btn-prio btn-bg-change-urgent-onclick prio-txt-color-set-white";
  document.getElementById("urgent" + id).style.boxShadow = "none";
  document.getElementById("urgentID" + id).className = "d-none";
  document.getElementById("urgent-whiteID" + id).className = "";
}

/**
 * Handles a click event on the "Medium" priority button. If "Medium" is already
 * selected, deselects it. Otherwise, deselects all other priority buttons and
 * selects "Medium".
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different sets of priority buttons.
 */
function clickOnMedium(id = "") {
  if (getTaskPrio(id) == "Medium") {
    clearPrioButtons(id);
    return;
  }

  clearPrioButtons(id);

  document.getElementById("medium" + id).className = "btn-prio btn-bg-change-medium-onclick prio-txt-color-set-white";
  document.getElementById("medium" + id).style.boxShadow = "none";
  document.getElementById("mediumID" + id).className = "d-none";
  document.getElementById("medium-whiteID" + id).className = "";
}

/**
 * Handles a click event on the "Low" priority button. If "Low" is already
 * selected, deselects it. Otherwise, deselects all other priority buttons and
 * selects "Low".
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different sets of priority buttons.
 */
function clickOnLow(id = "") {
  if (getTaskPrio(id) == "Low") {
    clearPrioButtons(id);
    return;
  }

  clearPrioButtons(id);

  document.getElementById("low" + id).className = "btn-prio btn-bg-change-low-onclick prio-txt-color-set-white";
  document.getElementById("low" + id).style.boxShadow = "none";
  document.getElementById("lowID" + id).className = "d-none";
  document.getElementById("low-whiteID" + id).className = "";
}

/**
 * Toggles the visibility of a dropdown menu.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different dropdown menus.
 */
function toggleDropdown(id = "") {
  document.getElementById("myDropdown" + id).classList.toggle("show");
}

/**
 * Closes the assigned-to dropdown menu when the user clicks outside of it.
 * Adds a global click event listener that checks if the click occurred
 * outside the dropdown and, if so, closes the dropdown.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different dropdown menus.
 */
function closeAssignedto(id = "") {
  let dropdown = document.getElementById('myDropdown' + id);
  let container = document.getElementById('contacts-list' + id);

  document.addEventListener('click', (event) => {
  if (!container.contains(event.target) && dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
  }
});
}

/**
 * Closes the category dropdown menu when the user clicks outside of it.
 * Adds a global click event listener that checks if the click occurred
 * outside the dropdown and, if so, closes the dropdown.
 */
function closeCategory() {
  let dropdown = document.getElementById('myDropdownCategory');
  let container = document.getElementById('category-container'); 

  document.addEventListener('click', (event) => {
  if (!container.contains(event.target) && dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
  }
});
}

/**
 * Toggles the visibility of the category dropdown menu.
 */
function toggleDropdownCategory() {
  document.getElementById("myDropdownCategory").classList.toggle("show");
}

/**
 * Retrieves a comma-separated string of names of assigned users.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different sets of assigned user checkboxes.
 * @returns {string} A comma-separated string of assigned user names, or an
 *                   empty string if no users are assigned.
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

/**
 * Asynchronously renders the assigned-to user list in the dropdown menu.
 * Loads user data, removes duplicate users based on email, and generates the
 * HTML for the assigned-to user list using the `createRenderAssignedToUserTemplate`
 * function.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different dropdown menus.
 * @returns {Promise<void>}
 */
async function renderAssignedTo(id = "") {
  let assignedMenu = document.getElementById("myDropdown" + id);
  let j = 1;

  assignedMenu.innerHTML = "";

  await loadUsers("/users");

  // remove doubles (only user should appear only once)
  let uniqueUsers = [];
  users.forEach(user => {
      if (!uniqueUsers.some(uniqueUser => uniqueUser.email == user.email)) {
          uniqueUsers.push(user.name.trim());
      }
  });

  let htmlContent = "";

  for (let i = 0; i < uniqueUsers.length; i++) {
      htmlContent += createRenderAssignedToUserTemplate(i, j, getUserInitials(uniqueUsers[i]), uniqueUsers[i], id);

      j++;
      if (j > 15) {
          j = 1;
      }
  }

  assignedMenu.innerHTML = htmlContent;
}

/**
 * Toggles the checked state of a checkbox and updates its background.
 * @param {string} checkboxId The ID of the checkbox element.
 */
function toggleCheckbox(checkboxId) {
  const checkbox = document.getElementById(checkboxId);
  checkbox.checked = !checkbox.checked;
  toggleBackground(checkbox);
}

/**
 * Toggles the background color and text color of a list item and adds/removes
 * a cloned contact circle to/from the selected contacts container based on the
 * checked state of a checkbox.
 * @param {HTMLInputElement} checkbox The checkbox element that triggered the toggle.
 */
function toggleBackground(checkbox) {
  const listItem = checkbox.closest(".list-item");
  const contactCircle = listItem.querySelector(".circle").cloneNode(true);

  const selectedContactsContainer = document.getElementById("selected-contacts-container" + popupIdString);

  if (checkbox.checked) {
    listItem.style.backgroundColor = "#2a3647";
    listItem.style.color = "white";

    // add contact circle to the contact container
    selectedContactsContainer.appendChild(contactCircle);
  } else {
    listItem.style.backgroundColor = "";
    listItem.style.color = "black";

    // remove contact circle to the contact container
    const circles = selectedContactsContainer.querySelectorAll(".circle");
    circles.forEach((circle) => {
      if (circle.textContent.trim() === contactCircle.textContent.trim()) {
        selectedContactsContainer.removeChild(circle);
      }
    });
  }
}


/*Begin Subtask input*/
document.addEventListener("DOMContentLoaded", () => {
  const subtaskInput = document.getElementById("addNewSubtaskInput");
  const subtaskBtnAdd = document.querySelector(".btn-subtask.add");
  const subtaskBtnCheckCancel = document.querySelector(".btn-subtask.check-cancel");
  const subtaskCancelBtn = document.querySelector(".cancel-subtask");
  const subtaskCheckBtn = document.querySelector(".check-subtask");

  let subtasks = [];

  function styleSubtaskInput() {
    subtaskBtnAdd.addEventListener("click", () => {
      subtaskBtnAdd.style.display = "none";
      subtaskBtnCheckCancel.style.display = "flex";
      subtaskInput.focus();
    });

    subtaskInput.addEventListener("focus", () => {
      subtaskBtnAdd.style.display = "none";
      subtaskBtnCheckCancel.style.display = "flex";
    });

    subtaskCancelBtn.addEventListener("click", () => {
      subtaskBtnAdd.style.display = "flex";
      subtaskBtnCheckCancel.style.display = "none";
      subtaskInput.value = "";
    });
  }

/**
 * Attaches click event listeners to the delete buttons of subtask list items.
 * When a delete button is clicked, the corresponding subtask is removed from the
 * `subtasks` array, and the subtask list is re-rendered.  This function should
 * be called *after* the subtask list items have been added to the DOM.  It
 * assumes that the `subtasks` array and `renderSubtasks` function are defined
 * elsewhere.
 */
  function deleteSubtask() {
    const subtaskListItems = document.querySelectorAll(".subtask-list-item");

    subtaskListItems.forEach((item, index) => {
      const deleteSubtaskBtn = item.querySelector(".delete-subtask-btn");
      deleteSubtaskBtn.addEventListener("click", () => {
        subtasks.splice(index, 1);
        renderSubtasks();
      });
    });
  }

/**
 * Attaches click and double-click event listeners to the edit buttons and list
 * items of subtasks. When an edit button or a list item is clicked/double-clicked,
 * the subtask item's content is replaced with an input field for editing.
 * The `createListItemTextContentTemplate`, `deleteSubtask`, and
 * `confirmSubtaskEdit` functions are assumed to be defined elsewhere. This
 * function should be called *after* the subtask list items have been added
 * to the DOM.
 */
  function editSubTask() {
    const subtaskListItems = document.querySelectorAll(".subtask-list-item");

    subtaskListItems.forEach((item) => {
      const editSubtaskBtn = item.querySelector(".edit-subtask-btn");

      const handleEdit = () => {
        let input = item.querySelector(".edit-subtask-input");
        if (!input) {
          let liText = item.querySelector(".li-text");
          item.innerHTML = createListItemTextContentTemplate(liText.textContent.trim());
          item.classList.add("subtask-list-item-edit");
          deleteSubtask();
          confirmSubtaskEdit();
        }
      };

      editSubtaskBtn.addEventListener("click", handleEdit);
      item.addEventListener("dblclick", handleEdit);
    });
  }


/**
 * Attaches click event listeners to the confirm buttons of subtask edit input
 * fields. When a confirm button is clicked, the edited subtask text is retrieved
 * from the input field, and if it's not empty, the `subtasks` array is updated,
 * and the subtask list is re-rendered. This function should be called *after*
 * the subtask edit input fields have been added to the DOM. It assumes that
 * the `subtasks` array and `renderSubtasks` function are defined elsewhere.
 */
  function confirmSubtaskEdit() {
    const subtaskListItemsEdit = document.querySelectorAll(".subtask-list-item-edit");

    subtaskListItemsEdit.forEach((item) => {
      const confirmSubtaskEditBtn = item.querySelector(".confirm-subtask-edit-btn");
      confirmSubtaskEditBtn.addEventListener("click", () => {
        const index = item.getAttribute("data-index");
        const input = item.querySelector(".edit-subtask-input");
        if (input.value !== "") {
          subtasks[index] = input.value;
          renderSubtasks();
        }
      });
    });
  }

/**
 * Adds a new subtask to the `subtasks` array and re-renders the subtask list.
 * The subtask text is retrieved from the `subtaskInput` element, and if it's
 * not empty or just whitespace, it's added to the array. The input field is
 * then cleared, and the appropriate buttons are shown/hidden.  Event listeners
 * are attached to the `subtaskCheckBtn` (click) and `subtaskInput` (Enter key)
 * to trigger the `addSubtask` function. It is assumed that the `subtaskInput`,
 * `subtaskCheckBtn`, `subtaskBtnAdd`, `subtaskBtnCheckCancel`, `subtasks` array,
 * and `renderSubtasks` function are defined elsewhere.
 */
  function addSubtask() {
    if (subtaskInput.value.trim() !== "") {
      subtasks.push(subtaskInput.value.trim());
      renderSubtasks();
      subtaskInput.value = "";
      subtaskBtnAdd.style.display = "flex";
      subtaskBtnCheckCancel.style.display = "none";
    }
  }

  // eventlistener to addsubtask via click
  subtaskCheckBtn.addEventListener("click", addSubtask);

  // eventlistener to addsubtask via enter on keyboard
   subtaskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addSubtask();
    }
  });

  /*
  ** renders the subtasks
  */

    function renderSubtasks() {
    const subtasksList = document.querySelector(".list-subtasks");
    subtasksList.innerHTML = "";
    subtasks.forEach((item, index) => {
      subtasksList.innerHTML += createSubtaskListItemAddTaskTemplate(index, item);
    });
    editSubTask();
    deleteSubtask();
  }



  styleSubtaskInput();
});

/*End Subtask input*/

document.addEventListener("DOMContentLoaded", function () {
  const dateInput = document.getElementById("due-date-input");

  // get todays Date in Format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // Set the min-Attribute to todays Date
  dateInput.setAttribute("min", today);
});

/**
 * Selects the technical stack category and updates the displayed category.
 * Retrieves the technical stack category from the element with the ID
 * 'categoryTechnicalStack' and sets it as the content of the element with the
 * ID 'category-displayed'.
 */
function selectTechnicalStack()
{
  let categoryTechnicalStack = document.getElementById('categoryTechnicalStack').innerHTML;

  let selectCategory = document.getElementById('category-displayed');
  selectCategory.innerHTML = '';
  selectCategory.innerHTML = categoryTechnicalStack;
}

/**
 * Selects the user story category and updates the displayed category.
 * Retrieves the user story category from the element with the ID 'categoryUserStory'
 * and sets it as the content of the element with the ID 'category-displayed'.
 */
function selectUserStory()
{
  let categoryselectUserStory = document.getElementById('categoryUserStory').innerHTML;

  let selectCategory = document.getElementById('category-displayed');
  selectCategory.innerHTML = '';
  selectCategory.innerHTML = categoryselectUserStory;
}

/**
 * Validates the task input form and creates a new task if the input is valid.
 * Prevents the default form submission behavior, performs validation checks
 * for title, due date, category, description, assigned users, and priority.
 * Displays error messages for invalid fields. If all fields are valid, calls
 * the `createTask` function to create the new task.
 * @param {Event} event The form submit event.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different task forms.
 */
function validateAndCreateTask(event, id = "") {
  event.preventDefault(); // stop default behaviour

  let isValid = true;

  // Title validation
  const title = document.getElementById('title');
  const titleRequired = document.getElementById('title-required');
  if (title.value.trim() === '') {
      titleRequired.style.display = 'block';
      isValid = false;
  } else {
      titleRequired.style.display = 'none';
  }

  // Due date validation
  const dueDate = document.getElementById('due-date-input');
  const dateRequired = document.getElementById('date-required');
  if (dueDate.value.trim() === '') {
      dateRequired.style.display = 'block';
      isValid = false;
  } else {
      dateRequired.style.display = 'none';
  }

  // Category validation
  const categoryContainer = document.getElementById('category-container');
  const categoryRequired = document.getElementById('category-required');
  if (categoryContainer.textContent.trim() === 'Select task category') {
      categoryRequired.style.display = 'block';
      isValid = false;
  } else {
      categoryRequired.style.display = 'none';
  }

  // Description validation
  const description = document.getElementById("description").value.trim();
  const descriptionError = document.getElementById("description-required");
  if (description === "") {
      descriptionError.style.display = "block";
      isValid = false;
  } else {
      descriptionError.style.display = "none";
  }

  // "Assigned To"-Validation
  const assignedToError = document.getElementById("assigned-to-required");
  const assignedUsers = getAssignedUsers(id);
  if (assignedUsers === "") {
      assignedToError.style.display = "block";
      isValid = false;
  } else {
      assignedToError.style.display = "none";
  }

  // Priority validation
const priority = getTaskPrio(id);
const priorityError = document.getElementById("prio-required");
if (priority === "None") {
    priorityError.style.display = "block";
    isValid = false;
} else {
    priorityError.style.display = "none";
}

  if (isValid) {
      createTask(id);
  }
}

/**
 * Clears the task input form, resetting all fields to their default values.
 * This includes clearing text inputs, resetting the displayed category, clearing
 * priority buttons, closing the assigned-to dropdown, hiding error messages,
 * clearing the subtask list, clearing the subtask input field (depending on
 * whether it's in a popup or not), clearing the selected contacts container,
 * and unchecking all assigned-to checkboxes.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different task forms.
 */
function clearForm(id = "") {
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('due-date-input').value = '';

  document.getElementById('category-displayed').textContent = 'Select task category';

  clearPrioButtons(id);
  clickOnMedium(id);

  closeAssignedto(id);

  document.getElementById('title-required').style.display = 'none';

  document.getElementById('date-required').style.display = 'none';

  document.getElementById('category-required').style.display = 'none';

  document.getElementById('description-required').style.display = 'none';

  document.getElementById('assigned-to-required').style.display = 'none';

  document.getElementById('prio-required').style.display = 'none';

  document.getElementById('subtaskList' + id).innerHTML = '';

  if(id == "Popup") {
    document.getElementById('addSubtaskInputPopup').value = '';
  } else {
    document.getElementById('addNewSubtaskInput').value = '';
  }

  document.getElementById('selected-contacts-container' + id).innerHTML = '';

  const checkboxes = document.querySelectorAll(`#myDropdown${id} input[type="checkbox"]`);
  checkboxes.forEach(checkbox => {
      checkbox.checked = false;
      const listItem = checkbox.closest(".list-item");
      listItem.style.backgroundColor = '';
      listItem.style.color = 'black';
  });  
}

/**
 * Displays a success message and redirects the user to the board page after 3 seconds.
 */
function showSuccessMessage() {
  const successMessage = document.querySelector('.msg-task-added');
  successMessage.style.display = 'flex';

  // after 3 seconds remove success message
  setTimeout(() => {
      successMessage.style.display = 'none';
      window.location.href = "board.html";
  }, 3000);
}