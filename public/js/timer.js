import { Leaderboard, StopWatch } from "./components/util.js";
import { fetchCurrentUser, fetchRaceDetails } from "./functions/fetch.js";

customElements.define('leaderboard-panel', Leaderboard);
customElements.define('stopwatch-panel', StopWatch);

const params = new URLSearchParams(window.location.search);
const raceId = Number(params.get('race_id'));

console.log("Race ID received: ", raceId);

document.addEventListener('DOMContentLoaded', async () => {
  const title = document.querySelector('#page-header');
  const welcomeMsg = document.querySelector('#welcome-msg');

  console.log(title, welcomeMsg);

  const user = await fetchCurrentUser();
  const race = await fetchRaceDetails(raceId);

  title.textContent = `Here you can record your lap times for the ${race.name}!`;
  welcomeMsg.textContent = `Welcome ${user.username}!`;

  console.log(title.textContent);
  console.log(welcomeMsg.textContent);
});