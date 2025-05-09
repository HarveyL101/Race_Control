export { NumberPad } from './NumberPad.js';
export { Leaderboard } from './Leaderboard.js';
export { StopWatch } from './StopWatch.js';
export { RaceFinder } from './RaceFinder.js';
export { Login } from './login/Login.js';
export { Register } from './login/Register.js';

export const sharedState = {
    time: 0,
    timerInterval: null,
    runnersFinished: 0
};

export function saveState({ time = sharedState.time, runnersFinished = sharedState.runnersFinished }) {

  localStorage.setItem("sharedState", JSON.stringify({ time, runnersFinished  }));

  console.log("sharedState has been sent to local storage");
}

export function loadState() {
  const stored = localStorage.getItem("sharedState");

  if (stored) {
    try {
      const parsed = JSON.parse(stored);

      // allocating values to their respective variables
      sharedState.time = parsed.time;
      sharedState.timerInterval = parsed.timerInterval;
      sharedState.runnersFinished = parsed.runnersFinished;

      console.log(`
        sharedState current state: ${parsed}
      `);
    } catch(error) {
      console.warn("Failed to retrieve sharedState from localStorage", error);
    }
  } 
  console.log("retrieved sharedState values: \n", sharedState);
}