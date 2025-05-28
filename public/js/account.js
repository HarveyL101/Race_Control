import { Admin } from "./components/util.js";
import { fetchCurrentUser } from "./functions/fetch.js";

customElements.define('admin-panel', Admin);

const el = {
  header_username: document.querySelector('#content-username'),
  header_user_id: document.querySelector('#content-user-id'),
  submitBtn: document.querySelector('#submit-button'),
  username: document.querySelector('#username'),
  old_password: document.querySelector('#old-pword'),
  new_password: document.querySelector('#new-pword')
};

const user = await fetchCurrentUser();

async function displayUserDetails() {
  try {
    if (!user) {
      el.username.textContent = "Not logged in";
      el.user_id.textContent = "";
      return;
    }

    el.header_username.textContent = `Username: ${user.username}`;
    el.header_user_id.textContent = `ID: #${user.id}`;

    return;
  } catch (error) {
    console.log("Could not display user details");
    return;
  }
}

function clearInputFields() {
  el.username.textContent = ''; 
  el.old_password.textContent = '';
  el.new_password.textContent = '';
}

async function submitPasswordChange() {
  const username = el.username.value;
  const old_password = el.old_password.value;
  const new_password = el.new_password.value;

  if (!username || !old_password || !new_password) {
    return alert("Missing Required fields");
  }

  const payload = {
    username: username,
    old_password: old_password,
    new_password: new_password
  }

  try {
    console.log("Payload to be sent: ", JSON.stringify(payload));

    if (!payload.username || !payload.old_password || !payload.new_password) {
      return alert("Missing Required fields");
    } 

    const response = await fetch('/api/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      return alert(error);
    }

    const result = await response.json();
    console.log(result);


    clearInputFields();
    return("Password Changed Successfully: ", result);

  } catch (error) {
    clearInputFields();
    return alert("Failed to change your password, please check your connection and try again.");
  }
}

el.submitBtn.addEventListener('click', submitPasswordChange);

displayUserDetails();





