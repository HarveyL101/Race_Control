export { NumberPad } from './timer/NumberPad.js';
export { StopWatch } from './timer/StopWatch.js';
export { Login } from './login/Login.js';
export { Admin } from './account/admin.js'

export const sharedState = {
    time: 0,
    timerInterval: null
};

// My method of keeping track of variables relevant to all three components in timer.html
export function saveState({ time = sharedState.time, timerInterval = sharedState.timerInterval }) {

  localStorage.setItem("sharedState", JSON.stringify({ time }));

  console.log("sharedState has been updated");
}

export function loadState() {
  const stored = localStorage.getItem("sharedState");

  if (stored) {
    try {
      const parsed = JSON.parse(stored);

      // allocating values to their respective variables
      sharedState.time = parsed.time;
      sharedState.timerInterval = parsed.timerInterval;

      console.log(`
        sharedState current state: ${parsed}
      `);
    } catch(error) {
      console.warn("Failed to retrieve sharedState from localStorage", error);
    }
  } 
  console.log("retrieved sharedState values: \n", sharedState);
}