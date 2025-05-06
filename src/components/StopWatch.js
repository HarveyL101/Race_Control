import { sharedState } from "./index.js";

// STOPWATCH CLASS COMPONENTS
export class StopWatch extends HTMLElement {
    constructor() {
      super();
  
      this.attachShadow({ mode: 'open' });

      this.time = sharedState.time;
      this.timerInterval = sharedState.timerInterval;
      this.runnersFinished = sharedState.runnersFinished;
    }
    connectedCallback() {
      if (!this.shadowRoot.hasChildNodes()) {
        this.showStopwatch();
        console.log("Displaying: {StopWatch}");
      }

      
      this.startBtn = this.shadowRoot.querySelector('#start-stop');
      this.timer = this.shadowRoot.querySelector('#timer');
      this.resetBtn = this.shadowRoot.querySelector('#reset');
      
      
      this.addEventListeners();
    }
    clearAll() {
      this.shadowRoot.innerHTML = '';
    }
    
    get stopwatchContent() {
      return document.querySelector('#stopwatch-template').content.cloneNode(true);
    }

    showStopwatch() {
      this.clearAll();
      this.shadowRoot.appendChild(this.stopwatchContent);
    }
    // Commented out but may be very useful when preparing rows for the database
/*
    parseTime(str) {
      const newDate = new Date();
      const [hours, minutes, seconds] = str.split(':').map(Number);
      
      newDate.setHours(hours, minutes, seconds, 0);

      return newDate;
    }
*/
    formatTime(seconds) {
      const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const remainder = String(Math.floor(seconds % 60)).padStart(2, '0');

      return (`${hours}:${minutes}:${remainder}`);
    }
    startTimer() {
      this.startBtn.textContent = "Stop";
    
      this.timerInterval = setInterval(() => {
        this.time++;
        
        //formats time values into appropriate format of 'HH:MM:SS'
        const timeString = this.formatTime(this.time);
    
        console.log(`${timeString}`);

        this.timer.textContent = timeString;
      }, 1000);
      
      console.log("startTimer() executed");
    }

    stopTimer() {
      this.startBtn.textContent = "Start"
    
      //stops timer from running and resets this.timerInterval to allow play-pause-play 
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    
      console.log("stopTimer() executed");
    }

    resetTimer() {
      this.timerInterval = null;
      this.time = 0;
      this.runnersFinished = 0;
      this.startBtn.textContent = "Start";
    
      //same as stopTimer() but resets time to base values
      clearInterval(this.timerInterval);
    
      this.timer.textContent = "00:00:00";
      console.log("resetTimer() executed");
    } 

    timerHandler() {
      // if timer is running, stop it, otherwise start the timer again
      if (this.timerInterval) {
        this.stopTimer();
      } else {
        this.startTimer();
      }
    }

    addEventListeners() {
      const startBtn = this.shadowRoot.querySelector('#start-stop');
      const resetBtn = this.shadowRoot.querySelector('#reset');

      startBtn.addEventListener('click', this.timerHandler.bind(this));
      resetBtn.addEventListener('click', this.resetTimer.bind(this));
    }
  }
