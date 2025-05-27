import { StopWatch } from "../components/util.js";
import { fetchCurrentUser, fetchRaceDetails } from "../functions/fetch.js";

customElements.define('stopwatch-panel', StopWatch);

const params = new URLSearchParams(window.location.search);
const raceId = Number(params.get('race_id'));

document.addEventListener('DOMContentLoaded', async () => {
  const stopwatch = document.querySelector('stopwatch-panel');

  const title = document.querySelector('#page-header');
  const welcomeMsg = document.querySelector('#welcome-msg');
  const navLinks = document.querySelectorAll('icon-buttons');

  const user = await fetchCurrentUser();
  const race = await fetchRaceDetails(raceId);

  title.textContent = `Record your lap times for the ${race.name}!`;
  welcomeMsg.textContent = `Good luck ${user.username}!`;

  // flushes localStorage upon leaving the home page (via home button/ 'back' icon)
  navLinks.addEventListener('click', () => {
    localStorage.clear();

    console.log("localStorage Cleared.");
  });

  window.addEventListener('online', () => {
    stopwatch.submitLap();
  });
});