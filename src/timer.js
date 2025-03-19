let time = 0;
let timerInterval = 0;
let timer = document.querySelector('#timer');
let startBtn = document.querySelector('#start-stop');
let resetBtn = document.querySelector('#reset');

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

  //same as stopTimer() but resets time to base values
  clearInterval(timerInterval);
  timerInterval = null;
  time = 0;

  timer.textContent = "00:00:00";
}


function timerHandler() {
  // if timer is running, stop it, otherwise start the timer again
  if (timerInterval) {
    stopTimer();
  } else {
    startTimer();
  }
}