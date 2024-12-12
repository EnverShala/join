 /*
  ** function to initialize login site: logo animation, then show logo container function
  */


function init() {
  document.getElementById("logo-container").classList.remove("start");
  document.getElementById("myBody").style.background = "white";
  setTimeout(showLoginContainer, 1500);
}

 /*
  ** shows the login container if no account is logged in, else direct to summary
  */

function showLoginContainer() {
  let loggedInAccount = localStorage.getItem("loggedInAccount");
  if(loggedInAccount) {
    if(loggedInAccount != "") {
      location.href = "./summary.html";
      return;
    }
  }

  document.getElementById("main_wrapper").classList.remove("d-none");
  document.getElementById("footerID").classList.remove("d-none")
  document.getElementById("authOpt").classList.remove("d-none")
  document.getElementById("logo-container").classList.remove("d-none");
  document.getElementById("login_section").classList.remove("d-none");
  document.getElementById("logo-container").classList.remove("transition2s");
}

/*
** routes guest to summary page
*/

function guestLogin() {
  window.location.href = 'summary.html';
}