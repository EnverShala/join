// dashboard.js

/**
 * Zeigt eine Begrüßungsnachricht basierend auf der aktuellen Tageszeit an.
 */
document.addEventListener("DOMContentLoaded", function () {
  displayGreeting();
  displayTaskStats();
  addTaskClickEvent();
});

/**
 * Funktion zur Anzeige der Begrüßungsnachricht.
 */
function displayGreeting() {
  const greetingElement = document.querySelector(".welcome-message h2");
  const userName = "[Benutzername]"; // Dies sollte dynamisch von einem Benutzerdatensatz abgerufen werden
  const currentHour = new Date().getHours();
  let greetingMessage = "Good morning, ";

  if (currentHour >= 12 && currentHour < 18) {
    greetingMessage = "Good afternoon, ";
  } else if (currentHour >= 18) {
    greetingMessage = "Good evening, ";
  }

  greetingElement.textContent = `${greetingMessage} ${userName}`;
}

/**
 * Funktion zur Anzeige der Aufgabenstatistiken.
 */
function displayTaskStats() {
  // Dummy-Daten für die Aufgaben
  const tasks = [
    { status: "To Do", count: 5 },
    { status: "In Progress", count: 3 },
    { status: "Awaiting Feedback", count: 2 },
    { status: "Done", count: 8 },
  ];

  tasks.forEach((task) => {
    const statElement = document.querySelector(`.stat-item.${task.status.toLowerCase().replace(/\s/g, "-")} p`);
    if (statElement) {
      statElement.textContent = task.count;
    }
  });

  // Nächste Deadline-Dummy-Daten
  const nextDeadline = "Task XYZ - Due in 2 days";
  const nextDeadlineElement = document.querySelector(".stat-item.next-deadline p");
  if (nextDeadlineElement) {
    nextDeadlineElement.textContent = nextDeadline;
  }
}

/**
 * Funktion, die den Klick auf eine Aufgabe behandelt und den Benutzer zum Kanban-Board weiterleitet.
 */
function addTaskClickEvent() {
  const statItems = document.querySelectorAll(".stat-item");
  statItems.forEach((item) => {
    item.addEventListener("click", function () {
      window.location.href = "kanban.html"; // Weiterleitung zur Kanban-Board-Seite
    });
  });
}
