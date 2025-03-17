let time = 0;
let interval;
let timer = document.querySelector('#timer');
let startBtn = document.querySelector('#start-stop');
let resetBtn = document.querySelector('#reset');

function startTimer() {
  console.log("startTimer has started");
  timer.textContent = "Stop"
  interval = 1;
  console.log("startTimer has concluded");
}

function stopTimer() {
  console.log("stopTimer has started");
  timer.textContent = "Start"
  interval = null;
  console.log("stopTimer has concluded");
}


function timerHandler() {
  if (interval) {
    stopTimer();
  } else {
    startTimer();
  }
}