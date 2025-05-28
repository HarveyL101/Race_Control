import { Admin } from "./components/util.js";
import { fetchCurrentUser } from "./functions/fetch.js";

customElements.define('admin-portal', Admin);

const el = {
  username: document.querySelector('#content-username'),
  user_id: document.querySelector('#content-user-id')
};

const user = await fetchCurrentUser(); 


el.username.textContent = `Username: ${user.username}`;
el.user_id.textContent = `ID: #${user.id}`

