import { fetchCurrentUser } from "./functions/functions.js";

const el = {
  welcomeMsg: document.querySelector('#welcome-msg')
};

const user = await fetchCurrentUser();


function applyUserDetails() {
  el.welcomeMsg.textContent = `Welcome ${user.username}!`;
}

function init() {
  applyUserDetails();
}

init();

