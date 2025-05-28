import { StopWatch, flushLocalData } from "/js/components/util.js";
import { fetchCurrentUser, fetchRaceDetails } from "/js/functions/fetch.js";

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
};

el.title.textContent = `Record your lap times for the ${race.name}!`;
el.welcomeMsg.textContent = `Good luck ${user.username}, remember to stay hydrated!`;

window.addEventListener('online', () => {
  stopwatch.submitLap();
});

el.homeBtn.addEventListener('click', flushLocalData);
el.backBtn.addEventListener('click', flushLocalData);