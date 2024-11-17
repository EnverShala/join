/*
** load and show summary information on summary page
*/

async function loadSummaryInfos() {
  await loadTasks();

  let sumTodo = 0;
  let sumDone = 0;
  let sumUrgent = 0;
  let sumTasks = 0;
  let sumProgress = 0;
  let sumFeedback = 0;

  for (let i = 0; i < tasks.length; i++) {
    sumTodo = tasks[i].level == "To do" ? sumTodo + 1 : sumTodo;
    sumDone = tasks[i].level == "Done" ? sumDone + 1 : sumDone;
    sumUrgent = tasks[i].priority == "Urgent" ? sumUrgent + 1 : sumUrgent;
    sumTasks = tasks.length;
    sumProgress = tasks[i].level == "In Progress" ? sumProgress + 1 : sumProgress;
    sumFeedback = tasks[i].level == "Awaiting Feedback" ? sumFeedback + 1 : sumFeedback;
  }

  document.getElementById("summary__todo").innerHTML = sumTodo;
  document.getElementById("summary__done").innerHTML = sumDone;
  document.getElementById("summary__urgent").innerHTML = sumUrgent;
  document.getElementById("summary__tasks").innerHTML = sumTasks;
  document.getElementById("summary__progress").innerHTML = sumProgress;
  document.getElementById("summary__feedback").innerHTML = sumFeedback;

  document.getElementById("summary__date").innerHTML = getUpcomingDeadline();
  greetUser();
}

/*
** check which task deadline is the nearest and show it on summary page
*/

function getUpcomingDeadline() {
  let upcomingDeadline = "0";
  let allDates = [];
  let taskDate = "";

  for (let i = 0; i < tasks.length; i++) {
    
    if (tasks[i].priority == "Urgent") {
      taskDate = taskDate = tasks[i].date.toString().replace("-", "");
      taskDate = taskDate.replace("-", "");

      allDates.push(taskDate);
    }
  }

  upcomingDeadline = Math.min(...allDates);

  upcomingDeadline = numberToDate(upcomingDeadline.toString());

  if(upcomingDeadline == 0 || allDates.length == 0) {
    return "";
  } else {
    return upcomingDeadline;
  }
}

/*
** return a YYYY-DD-MM date as day month-as-name year
*/

function numberToDate(numberDate) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return `${months[numberDate.slice(-4, -2) - 1]} ${numberDate.slice(-2)}, ${numberDate.slice(0, 4)}`;
}

/*
** user greeting message depending on daytime
*/

function greetUser() {
  const now = new Date();
  const hour = now.getHours();
  let greeting;

  if (hour < 12) {
      greeting = "Good Morning,";
  } else if (hour < 18) {
      greeting = "Good Afternoon,";
  } else {
      greeting = "Good Evening,";
  }

  document.getElementById("greeting__text").innerText = greeting;
}

