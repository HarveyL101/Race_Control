



// STOPWATCH CLASS COMPONENTS
export default class StopWatch extends HTMLElement {
    constructor() {
      super();
  
      this.attachShadow({ mode: 'open' });

      this.time = 0;
      this.timerInterval = null;
      this.runnersFinished = 0;
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

    startTimer() {
      this.startBtn.textContent = "Stop";
    
      this.timerInterval = setInterval(() => {
        this.time++;
    
        const hours = Math.floor(this.time / 3600);
        const minutes = Math.floor((this.time % 3600) / 60);
        const seconds = this.time % 60;
    
        //formats time values into appropriate format of 'HH:MM:SS'
        this.timer.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
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
