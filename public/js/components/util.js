export { NumberPad } from './timer/NumberPad.js';
export { Leaderboard } from './timer/Leaderboard.js';
export { StopWatch } from './timer/StopWatch.js';
export { Login } from './login/Login.js';
export { Account } from './Account.js'

export const sharedState = {
    time: 0,
    timerInterval: null,
    lapsFinished: 1
};

// My method of keeping track of variables relevant to all three components in timer.html
export function saveState({ time = sharedState.time, runnersFinished = sharedState.runnersFinished, lapsFinished = sharedState.lapsFinished}) {

  localStorage.setItem("sharedState", JSON.stringify({ time, runnersFinished, lapsFinished }));

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