let time = 0,
  timerInterval = null,
  runnersFinished = 0;

const timer = document.querySelector('#timer'),
  startBtn = document.querySelector('#start-stop'),
  resetBtn = document.querySelector('#reset'),
  leaderboard = document.querySelector('#leaderboard');

function startTimer() {
  console.log("startTimer has started");
  startBtn.textContent = "Stop"

  timerInterval = setInterval(() => {
    time++;

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    //formats time values into appropriate format of 'HH:MM:SS'
    timer.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, 1000);
  
  console.log("startTimer has concluded");
}

function stopTimer() {
  console.log("stopTimer has started");
  startBtn.textContent = "Start"

  //stops timer from running and resets timerInterval to allow play-pause-play 
  clearInterval(timerInterval);
  timerInterval = null;

  console.log("stopTimer has concluded");
}

function resetTimer() {
  console.log("resetTimer() Called");

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
}

function leaderboardUpdate() {
  runnersFinished++;
  let time = timer.textContent;

  console.log(time);

  const newItem = document.createElement('li');

  const newContent = document.createTextNode(`Position ${runnersFinished}: ${timer.textContent}`);

  newItem.appendChild(newContent);

  leaderboard.appendChild(newItem);
}

function timerHandler() {
  // if timer is running, stop it, otherwise start the timer again
  if (timerInterval) {
    stopTimer();
  } else {
    startTimer();
  }
}

function showMessages(messages, where) {
  for (const msg of messages) {
    const li = document.createElement('li');
    li.textContent = msg;
    where.appendChild(li);
  }
}

function pageLoaded() {
  loadMessages();
}

pageLoaded();