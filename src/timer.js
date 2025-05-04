class NumberPad extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open"})
  }
}
let time = 0,
  timerInterval = null,
  runnersFinished = 0;

const timer = document.querySelector('#timer'),
  startBtn = document.querySelector('#start-stop'),
  resetBtn = document.querySelector('#reset'),
  leaderboard = document.querySelector('#leaderboard-list');

function startTimer() {
  startBtn.textContent = "Stop"

  timerInterval = setInterval(() => {
    time++;

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    //formats time values into appropriate format of 'HH:MM:SS'
    timer.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, 1000);
  
  console.log("startTimer() executed");
}

function stopTimer() {
  startBtn.textContent = "Start"

  //stops timer from running and resets timerInterval to allow play-pause-play 
  clearInterval(timerInterval);
  timerInterval = null;

  console.log("stopTimer() executed");
}

function resetTimer() {
  timerInterval = null;
  time = 0;
  runnersFinished = 0;
  startBtn.textContent = "Start";

  //same as stopTimer() but resets time to base values
  clearInterval(timerInterval);
  
  while(leaderboard.firstChild) {
    leaderboard.removeChild(leaderboard.firstChild);
  }

  timer.textContent = "00:00:00";
  console.log("resetTimer() executed");
}
function getPositions() {
  let payload = {}
  const leaderboard = document.querySelector('#leaderboard');

  for (let item of leaderboard) {

  }
}

function leaderboardUpdate() {
  runnersFinished++;
  const time = timer.textContent;

  const li = document.createElement('li');
  const idField = document.createElement('input');
  li.id = `runner-${runnersFinished}`;
  li.textContent = `${timer.textContent}`;

  leaderboard.appendChild(li);

  console.log(`${li.id}: ${li.textContent}`);
}

function timerHandler() {
  // if timer is running, stop it, otherwise start the timer again
  if (timerInterval) {
    stopTimer();
  } else {
    startTimer();
  }
}