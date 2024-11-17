// kanban.js

document.addEventListener("DOMContentLoaded", function() {
    initializeDragAndDrop();
    addTaskEventListeners();
});

/**
 * Initialisiert die Drag-and-Drop-Funktionalität für die Aufgaben.
 */
function initializeDragAndDrop() {
    const tasks = document.querySelectorAll(".task");
    const columns = document.querySelectorAll(".column");

    tasks.forEach(task => {
        task.addEventListener("dragstart", dragStart);
        task.addEventListener("dragend", dragEnd);
    });

    columns.forEach(column => {
        column.addEventListener("dragover", dragOver);
        column.addEventListener("drop", drop);
    });
}

/**
 * Funktion, die beim Start des Dragging ausgeführt wird.
 * @param {Event} e - Das Drag-Event.
 */
function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
    setTimeout(() => {
        e.target.classList.add("hidden");
    }, 0);
}

/**
 * Funktion, die beim Ende des Dragging ausgeführt wird.
 * @param {Event} e - Das Drag-Event.
 */
function dragEnd(e) {
    e.target.classList.remove("hidden");
}

/**
 * Funktion, die beim Überziehen einer Spalte ausgeführt wird.
 * @param {Event} e - Das Drag-Event.
 */
function dragOver(e) {
    e.preventDefault();
}

/**
 * Funktion, die beim Loslassen einer Aufgabe in einer Spalte ausgeführt wird.
 * @param {Event} e - Das Drop-Event.
 */
function drop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text");
    const task = document.getElementById(id);
    const column = e.target.closest(".column");
    column.appendChild(task);
    updateTaskStatus(task, column);
}

/**
 * Aktualisiert den Status einer Aufgabe basierend auf der Spalte, in der sie abgelegt wurde.
 * @param {HTMLElement} task - Die Aufgabe, deren Status aktualisiert werden soll.
 * @param {HTMLElement} column - Die Spalte, in der die Aufgabe abgelegt wurde.
 */
function updateTaskStatus(task, column) {
    const status = column.querySelector("h2").textContent;
    task.dataset.status = status;
}

/**
 * Fügt Event-Listener für das Hinzufügen neuer Aufgaben hinzu.
 */
function addTaskEventListeners() {
    const addTaskButtons = document.querySelectorAll(".add-task");

    addTaskButtons.forEach(button => {
        button.addEventListener("click", function() {
            const taskTitle = prompt("Enter task title:");
            if (taskTitle) {
                createTask(taskTitle, button.parentElement);
            }
        });
    });
}

/**
 * Erstellt eine neue Aufgabe und fügt sie der angegebenen Spalte hinzu.
 * @param {string} title - Der Titel der neuen Aufgabe.
 * @param {HTMLElement} column - Die Spalte, der die neue Aufgabe hinzugefügt werden soll.
 */
function createTask(title, column) {
    const task = document.createElement("div");
    task.className = "task";
    task.id = `task-${Date.now()}`;
    task.draggable = true;
    task.innerHTML = `
        <div class="task-header">
            <span class="task-type">New Task</span>
        </div>
        <h3>${title}</h3>
        <div class="task-footer">
            <div class="progress">
                <div class="progress-bar" style="width: 0;"></div>
            </div>
            <div class="assignees"></div>
        </div>
    `;
    column.appendChild(task);

    task.addEventListener("dragstart", dragStart);
    task.addEventListener("dragend", dragEnd);
}
