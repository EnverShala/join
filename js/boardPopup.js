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
  function editSubtaskPopup(item) {
    let subtasksListPopup = document.getElementById("subtaskListPopup");
    let listLength = subtasksListPopup.getElementsByTagName("li").length;

    for(let i = 0; i < listLength; i++) {
        let listChild = subtasksListPopup.getElementsByTagName("li")[i];

        if(listChild.textContent.trim() == item) {
            listChild.innerHTML = changeSubtaskContentToInputForEditPopupTemplate(i, listChild.textContent.trim());
            break;
        }
    }
  }
  
  /**
   * Deletes a subtask from the subtask list in the popup at the specified position.
   *
   * @param {number} position The index of the subtask to delete.
   */
  function deleteSubtaskPopup(item) {
    let subtasksListPopup = document.getElementById("subtaskListPopup");
    let listLength = subtasksListPopup.getElementsByTagName("li").length;
    
    for(let i = 0; i < listLength; i++) {
        let listChild = subtasksListPopup.getElementsByTagName("li")[i];

        if(listChild.textContent.trim() == item) {
            subtasksListPopup.removeChild(listChild);
  
            subtasksArrayPopup.splice(i, 1);
            break;
        }
    }
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
        taskLevel = "To do";
        modal.showModal();
        renderAssignedTo("Popup");
        activatePrioButton("Medium", "Popup");
        clearForm("Popup");
      });
  
      // close modal
      alsoOpenButtons.forEach((button) => {
        button.addEventListener("click", () => {

          if(button.id == "alsoOpenModal2") { taskLevel = "In Progress"; }
          else if(button.id == "alsoOpenModal3") { taskLevel = "Awaiting Feedback"; }
          else if(button.id == "alsoOpenModal4") { taskLevel = "Done"; }
          else { taskLevel = "To do"; }

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
        taskLevel = "To do";
      });
  
      // closing the modal wenn clicking out of the modal
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          modal.close();
          popupIdString = "";
          taskLevel = "To do";
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
          tasks[i].description.toLowerCase().includes(searchBar.toLowerCase())
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
  