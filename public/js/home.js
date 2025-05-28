import { fetchCurrentUser } from "./functions/fetch.js";

const el = {
  title: document.querySelector('#page-header'),
  welcomeMsg: document.querySelector('#welcome-msg')
};

const user = await fetchCurrentUser();  

el.title.textContent = `Welcome ${user.username}, We Hope You Enjoy Your Stay!`;

