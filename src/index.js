const el = {};

function runnerSetup() {
  if (el.runnerCheckbox.checked) {
    el.accountType.value = 'runners';
    el.volunteerCheckbox.checked = false;
    console.log("accountType Value (raw): ", el.accountType.value);
  }
}

function volunteerSetup() {
  if (el.volunteerCheckbox.checked) {
    el.accountType.value = 'volunteers';
    el.runnerCheckbox.checked = false;
    console.log("accountType Value (raw): ", el.accountType.value);
  }
}

function prepareHandlers() {
  el.accountType = document.querySelector('#account-type');
  el.runnerCheckbox = document.querySelector('#runner-chk');
  el.volunteerCheckbox = document.querySelector('#volunteer-chk');
  el.loginForm = document.querySelector('#login-form');
}

function addEventListeners() {
  el.runnerCheckbox.addEventListener('change', runnerSetup);
  el.volunteerCheckbox.addEventListener('change', volunteerSetup);
}

function init() {
  prepareHandlers();

  // Ensures boxes are `unchecked` on page load to avoid errors
  el.runnerCheckbox.checked = false;
  el.volunteerCheckbox.checked = false;

  // adds event listeners after state is appropriately set
  addEventListeners();
}

init();
