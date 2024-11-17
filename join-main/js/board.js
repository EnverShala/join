const taskCard = document.getElementById('taskCard');
const dropZones = document.querySelectorAll('#cardContainertoDo, #cardContainerinProgress, #cardContainerawaitingFeedback, #cardContainerdone');
/*const openButton = document.querySelector("data-open-modal")
const closeButton = document.querySelector("data-close-modal")
const modal = document.querySelector("data-modal")*/

// Event listener für den Start des Drag-Vorgangs
taskCard.addEventListener("dragstart", function (event) {
  // Die ID des zu ziehenden Elements wird in den Datenübertragungsobjekt gespeichert
  event.dataTransfer.setData("text/plain", event.target.id);
});

// Event listener für jede Drop-Zone
dropZones.forEach((dropZone) => {
  dropZone.addEventListener("dragover", function (event) {
    // Verhindert das Standardverhalten, damit das Drop-Ereignis ausgelöst wird
    event.preventDefault();
  });

  dropZone.addEventListener("drop", function (event) {
    // Verhindert das Standardverhalten beim Drop
    event.preventDefault();
    // Holt die ID des gezogenen Elements
    const draggedElementId = event.dataTransfer.getData("text/plain");
    // Holt das Element mit dieser ID
    const draggedElement = document.getElementById(draggedElementId);
    // Fügt das gezogene Element in die aktuelle Drop-Zone ein
    dropZone.prepend(draggedElement);
  });
});

function openDialog() {
  document.getElementById("popupOnTaskSelectionID").style.visibility = "visible";
}
function closeDialog() {
  document.getElementById("popupOnTaskSelectionID").style.visibility = "hidden";
}

function popupValueImplementFromTask()
{   
    let titelCardInput = document.getElementById('titelCardID').innerHTML;
    let descriptionCard = document.getElementById('descriptionCardID').innerHTML;
    let contactEllipse = document.getElementById('profileBadges').innerHTML;
    
    let valueFromTask = document.getElementById('popupHeaderID');
    valueFromTask.innerHTML = titelCardInput;
    let valueFromdescription = document.getElementById('popupSpanID');
    valueFromdescription.innerHTML = descriptionCard;
    
    let valueFromEllipse = document.getElementById('popupContactEllipseID');
    valueFromEllipse.innerHTML = '';     
    valueFromEllipse.innerHTML += contactEllipse;

    let valueFromName = document.getElementById('popupContactNameID');
    valueFromName.innerHTML = '';   

    // for(let i = 0; i < users.length; i++) {
    //     valueFromName.innerHTML += `
    //         <div>${users[i].name}</div>
    //         `;
    // }

}

async function renderBadges() {
  await loadUsers("/users");

  let myBadges = document.getElementById("profileBadges");
  let j = 1;

  myBadges.innerHTML = "";

  for (let i = 0; i < users.length; i++) {
    myBadges.innerHTML += `
            <div class="badgeImg initialsColor${j}">${getUserInitials(users[i].name)}</div>
            `;

    j++;
    if (j > 15) {
      j = 1;
    }
  }

  renderTaskCards();
}

async function renderTaskCards() {
  await loadTasks("/tasks");

  document.getElementById("taskCard").innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    document.getElementById("taskCard").innerHTML += `
              <div class="taskCardTop">
                  <label class="categoryGreen">TECHNICAL STACK</label>
                <div class="dropdownCard">
                  <button onclick="toggleDropdown('dropdown-content')" class="dropdown-btn">
                    <div class="dropdownBtnContainer"><img src="" alt="Dropdown Arrow"></div>
                    </button>
                 <div id="dropdown-content" class="dropdown-content">
                    <p onclick="">In Progress</p>
                    <p onclick="">Done</p>
                    <p onclick="">Awaiting Feedback</p>
                  </div>
                </div>
              </div>
              <div class="cardBody" onclick="openDialog(); popupValueImplementFromTask()">
                <p id="titelCardID" class="titleCard">HTML Base Template Creation</p>
                <p id="descriptionCardID" class="descriptionCard">Create reusable HTML base templates</p>
                <div>
                  <div class="progress">
                    <div class="progressBarContainer">
                      <div id="" class="progressBar" style="width: 50%;"></div>
                    </div>
                    <p class="amountSubtasks">1/2</p>
                  </div>
                  <div class="footerCard ">
                    <div id="profileBadges" class="profileBadges">
                      <div class="badgeImg" style="background-color: #F8C4E4">BZ</div>
                      <div class="badgeImg" style="background-color: #47FDC3">SM</div>
                      <div class="badgeImg" style="background-color: #1213AA">MB</div>
                      <div class="badgeImg" style="background-color: #144C6B">TW</div>
                    </div>
                    <div class="prioImg">
                      <img src="./img/medium.svg" alt="">
                    </div>
                  </div>
                </div>
              </div>
            </div> 
          </div>   
                `;
  }
}


/*AddTask Pop up*/

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('dialog[data-modal]');
    const openModalButton = document.getElementById('openModal');
    const closeModalButton = document.getElementById('closeModal');
    const alsoOpenButtons = document.querySelectorAll('.alsoOpenModal'); // Alle Elemente mit der Klasse "alsobtn"


    if (modal && openModalButton && closeModalButton) {
        // Modal öffnen
        openModalButton.addEventListener('click', () => {
            modal.showModal();
        });

        alsoOpenButtons.forEach(button => {
            button.addEventListener('click', () => {
                modal.showModal();
            });
        });


        // Modal schließen
        closeModalButton.addEventListener('click', () => {
            modal.close();
        });

        // Optional: Modal schließen, wenn man außerhalb des Modals klickt
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.close();
            }
        });
    } else {
        console.error('Modal, Open Button, or Close Button not found in the DOM.');
    }
});



/*openButton.addEventListener("click", () => {
    modal.showModal()
})

closeButton.addEventListener("click", () => {
    modal.close()
})
*/
