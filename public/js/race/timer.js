import { Leaderboard, StopWatch } from "../components/util.js";
import { fetchCurrentUser, fetchRaceDetails } from "../functions/fetch.js";

customElements.define('leaderboard-panel', Leaderboard);
customElements.define('stopwatch-panel', StopWatch);

const params = new URLSearchParams(window.location.search);
const raceId = Number(params.get('race_id'));

document.addEventListener('DOMContentLoaded', async () => {
  const title = document.querySelector('#page-header');
  const welcomeMsg = document.querySelector('#welcome-msg');

  const user = await fetchCurrentUser();
  const race = await fetchRaceDetails(raceId);

  title.textContent = `Record your lap times for the ${race.name}!`;
  welcomeMsg.textContent = `Good luck ${user.username}!`;
});