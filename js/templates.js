/*
** task card template for render task cards function
*/

function taskCardTemplate(uniqueId, i, subTasksArray, assignedUsersHTML) {
  let subtasksDone = tasks[i].subtasksDone;

  if(subtasksDone.endsWith("|")) {
    subtasksDone = subtasksDone.slice(0, -1);
  }

  subtasksDone = subtasksDone == "" ? [] : subtasksDone.split("|");

  let widthPercent = (100 / subTasksArray.length) * subtasksDone.length;

  return `
                <div draggable="true" id="${uniqueId}" class="taskCard">
                <div class="taskCardTop">
                  <label class="categoryGreen">${tasks[i].category}</label>
                  <div class="dropdownCard">
                    <button onclick="toggleDropdown('dropdown-content')" class="dropdown-btn">
                      <div class="dropdownBtnContainer">
                        <img src="" alt="Dropdown Arrow">
                      </div>
                    </button>
                    <div id="dropdown-content" class="dropdown-content">
                      <p onclick="">In Progress</p>
                      <p onclick="">Done</p>
                      <p onclick="">Awaiting Feedback</p>
                    </div>
                  </div>
                </div>
                <div class="cardBody" onclick="openDialog(); popupValueImplementFromTask(${i})">
                  <p id="titelCardID" class="titleCard">${tasks[i].title}</p>
                  <p id="descriptionCardID" class="descriptionCard">${tasks[i].description}</p>
                  <div>
                    <div class="progress">
                      <div class="progressBarContainer">
                        <div id="" class="progressBar" style="width: ${widthPercent}%;"></div>
                      </div>
                      <p class="amountSubtasks">${subTasksArray.length} subtask(s)</p>
                    </div>
                    <div class="footerCard">
                      <div id="profileBadges${i}" class="profileBadges">
                        ${assignedUsersHTML}
                      </div>
                      <div class="prioImg">
                        <img src="./img/${tasks[i].priority.toLowerCase()}.svg" alt="">
                      </div>
                    </div>
                  </div>
                </div>
              </div>  
                  `;
}

/*
** template for creating contact into contact list
*/

function contactTemplate(i, j, x) {
  return `<div id="user-container${i}">
            <div id="contact-containerID${x}" class="contact-container" onclick="loadUserInformation(${i}); hideContactsListInResponsiveMode()">
            <div class="contact-list-ellipse">
               <div id="userColor${i}" class="ellipse-list initialsColor${j}">${getUserInitials(users[i].name)}</div>
            </div>
            <div class="contact">
                <div class="contact-list-name" id="contactName">${users[i].name}</div>
                <div class="contact-list-email" id="contactEmail">${users[i].email}</div>
            </div>
            </div>
            </div>
            `;
}

/*
** template for creating render assigned to menu user
*/

function createRenderAssignedToUserTemplate(i, j, userInitials, userName, id = "") {
  return `
        <label onclick="event.stopPropagation()"><li class="list-item assigned-to"></label>
            <div class="list-item-name" onclick="toggleCheckbox('AssignedContact${id}${i}', '${id}')">
                <label><div class="circle initialsColor${j}">${userInitials}</div></label>
                <label>${userName}</label>
            </div>
            <input type="checkbox" onclick="toggleBackground(this)" id="AssignedContact${id}${i}" name="AssignedContact">
        </li>
    `;
}

/*
** template for creating subtask list item for add Task
*/

function createSubtaskListItemAddTaskTemplate(index, item) {
  if(item == "") { return ""; }
  return `
            <li class="subtask-list-item" data-index="${index}">
                <div class="li-text">${item}</div>
                <div class="subtask-edit-icon-div">
                    <img id="editTask${index}" class="edit-subtask-btn" src="./img/edit.png" alt="">
                    <div class="subtask-divider-2"></div>
                    <img id="deleteSubtask${index}"class="delete-subtask-btn" src="./img/delete.png" alt="">
                </div>
            </li>
        `;
}

/*
** template for creating subtask list item
*/

function createSubtaskListItemTemplate(index, item) {
  if(item == "") { return ""; }
  return `
            <li class="subtask-list-item" data-index="${index}">
                <div class="li-text">${item}</div>
                <div class="subtask-edit-icon-div">
                    <img onclick="editSubtask(${index})" id="editTask${index}" class="edit-subtask-btn" src="./img/edit.png" alt="">
                    <div class="subtask-divider-2"></div>
                    <img onclick="deleteSubtask(${index})" id="deleteSubtask${index}"class="delete-subtask-btn" src="./img/delete.png" alt="">
                </div>
            </li>
        `;
}

/*
** template for creating subtask list item for add task Popup
*/

function createSubtaskListItemPopupTemplate(index, item) {
  return `
            <li class="subtask-list-item" data-index="${index}">
                <div class="li-text">${item}</div>
                <div class="subtask-edit-icon-div">
                    <img onclick="editSubtaskPopup(${index})" id="editTaskPopup${index}" class="edit-subtask-btn" src="./img/edit.png" alt="">
                    <div class="subtask-divider-2"></div>
                    <img onclick="deleteSubtaskPopup(${index})" id="deleteSubtaskPopup${index}"class="delete-subtask-btn" src="./img/delete.png" alt="">
                </div>
            </li>
        `;
}

/*
** changes the subtask input field (for editing) back into a list element
*/

function changeSubtaskInputFieldBackToListElement(index, item) {
  return `
                <div class="li-text">${item}</div>
                <div class="subtask-edit-icon-div">
                    <img onclick="editSubtask(${index})" id="editTask${index}" class="edit-subtask-btn" src="./img/edit.png" alt="">
                    <div class="subtask-divider-2"></div>
                    <img onclick="deleteSubtask(${index})" id="deleteSubtask${index}"class="delete-subtask-btn" src="./img/delete.png" alt="">
                </div>
        `;
}

/*
** changes the subtask input field (for editing) back into a list element for add task popup
*/

function changeSubtaskInputFieldBackToListElementPopup(index, item) {
  return `
                <div class="li-text">${item}</div>
                <div class="subtask-edit-icon-div">
                    <img onclick="editSubtaskPopup(${index})" id="editTaskPopup${index}" class="edit-subtask-btn" src="./img/edit.png" alt="">
                    <div class="subtask-divider-2"></div>
                    <img onclick="deleteSubtaskPopup(${index})" id="deleteSubtaskPopup${index}"class="delete-subtask-btn" src="./img/delete.png" alt="">
                </div>
        `;
}

/*
** changes the subtask list item into an inpud field to edit the subtask
*/

function changeSubtaskContentToInputForEditTemplate(position, actualContent) {
  return `
    <input id="editSubtaskInput${position}" class="edit-subtask-input" type="text" value="${actualContent}" onkeydown = "subtaskOnKeyDown(${position})">
    <div class="edit-subtask-button-div">
    <span onclick="cancelSubtaskEdit(${position})" id="cancelSubtaskEdit${position}" class="delete-subtask-btn edit"><img src="./img/delete.png"></span>
    <div class="subtask-divider"></div>
    <span onclick="confirmSubtaskEdit(${position})" id="confirmSubtaskEdit${position}" class="confirm-subtask-edit-btn edit"><img src="./img/check.png"></span>
    </div>
`;
}

/*
** changes the subtask list item into an inpud field to edit the subtask
*/

function changeSubtaskContentToInputForEditPopupTemplate(position, actualContent) {
  return `
    <input id="editSubtaskInputPopup${position}" class="edit-subtask-input" type="text" value="${actualContent}" onkeydown = "subtaskOnKeyDownPopup(${position})">
    <div class="edit-subtask-button-div">
    <span onclick="cancelSubtaskEditPopup(${position})" id="cancelSubtaskEditPopup${position}" class="delete-subtask-btn edit"><img src="./img/delete.png"></span>
    <div class="subtask-divider"></div>
    <span onclick="confirmSubtaskEditPopup(${position})" id="confirmSubtaskEditPopup${position}" class="confirm-subtask-edit-btn edit"><img src="./img/check.png"></span>
    </div>
`;
}

/*
** template for creating list item text content
*/

function createListItemTextContentTemplate(textContent) {
  return `
                    <input class="edit-subtask-input" type="text" value="${textContent}">
                    <div class="edit-subtask-button-div">
                        <span class="delete-subtask-btn edit"><img src="./img/delete.png"></span>
                        <div class="subtask-divider"></div>
                        <span class="confirm-subtask-edit-btn"><img src="./img/check.png"></span>
                    </div>
                `;
}