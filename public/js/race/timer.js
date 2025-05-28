import { StopWatch } from "../components/util.js";
import { fetchCurrentUser, fetchRaceDetails } from "../functions/fetch.js";

customElements.define('stopwatch-panel', StopWatch);

const params = new URLSearchParams(window.location.search);
const raceId = Number(params.get('race_id'));

const user = await fetchCurrentUser();
const race = await fetchRaceDetails(raceId);

const stopwatch = document.querySelector('stopwatch-panel');

const el = {
  title: document.querySelector('#page-header'),
  welcomeMsg: document.querySelector('#welcome-msg'),
  homeBtn: document.querySelector('#home-button'),
  backBtn: document.querySelector('#back-button')
}

el.title.textContent = `Record your lap times for the ${race.name}!`;
el.welcomeMsg.textContent = `Good luck ${user.username}!`;

// flushes localStorage upon leaving the home page (via home button/ 'back' icon)
function flushLocalData() {
  // simple logic thanks to pre-made .clear() function
  confirm("Are you sure? any locally stored data will be lost.");
  localStorage.clear();

  console.log("Local Storage has been wiped");
}

el.homeBtn.addEventListener('click', flushLocalData);
el.backBtn.addEventListener('click', flushLocalData);

window.addEventListener('online', () => {
  stopwatch.submitLap();
});
