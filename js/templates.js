/*
** task card template for render task cards function
*/

function taskCardTemplate(uniqueId, i, subTasksArray, assignedUsersHTML) {
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
                        <div id="" class="progressBar" style="width: 50%;"></div>
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

function contactTemplate(i, j) {
  return `<div id="user-container${i}">
            <div id="contact-containerID" class="contact-container" onclick="loadUserInformation(${i}); hideContactsListInResponsiveMode()">
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

function createRenderAssignedToUserTemplate(i, j, userInitials, userName) {
  return `
        <label onclick="event.stopPropagation()"><li class="list-item assigned-to"></label>
            <div class="list-item-name" onclick="toggleCheckbox('AssignedContact${i}')">
                <label><div class="circle initialsColor${j}">${userInitials}</div></label>
                <label>${userName}</label>
            </div>
            <input type="checkbox" onclick="toggleBackground(this)" id="AssignedContact${i}" name="AssignedContact">
        </li>
    `;
}

/*
** template for creating subtask list item
*/

function createSubtaskListItemTemplate(index, item) {
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
** changes the subtask list item into an inpud field to edit the subtask
*/

function changeSubtaskContentToInputForEditTemplate(position, actualContent) {
  return `
    <input id="editSubtaskInput${position}" class="edit-subtask-input" type="text" value="${actualContent}">
    <div class="edit-subtask-button-div">
    <span onclick="cancelSubtaskEdit(${position})" id="cancelSubtaskEdit${position}" class="delete-subtask-btn edit"><img src="./img/delete.png"></span>
    <div class="subtask-divider"></div>
    <span onclick="confirmSubtaskEdit(${position})" id="confirmSubtaskEdit${position}" class="confirm-subtask-edit-btn edit"><img src="./img/check.png"></span>
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