import { sharedState, saveState } from "../util.js";
import { fetchCurrentUser, fetchRaceDetails, fetchCurrentLap  } from "/js/functions/fetch.js";

const params = new URLSearchParams(window.location.search);
const raceId = Number(params.get('race_id'));

const runner = await fetchCurrentUser();
const race = await fetchRaceDetails(raceId);

// STOPWATCH CLASS COMPONENTS
export class StopWatch extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

  }

  connectedCallback() {
    if (!this.shadowRoot.hasChildNodes()) {
      this.showStopwatch();
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

  //transforms time values into the format (HH:MM:SS), widely used in this app
  formatTime(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const remainder = String(seconds % 60).padStart(2, '0');

    return (`${hours}:${minutes}:${remainder}`);
  }

  startTimer() {
    this.startBtn.textContent = "Stop";

    sharedState.timerInterval = setInterval(() => {
      sharedState.time++;
      
      
      const timeString = this.formatTime(sharedState.time);
  
      this.timer.textContent = timeString;
    }, 1000);
    
    console.log("startTimer() executed");
  }

  stopTimer() {
    this.startBtn.textContent = "Start"
  
    //stops timer from running and resets this.timerInterval to allow play-pause-play 
    clearInterval(sharedState.timerInterval);
    sharedState.timerInterval = null;
  
    console.log("stopTimer() executed");
  }

  resetTimer() {
    const confirmed = confirm("Have you submitted your results? Your currently stored lap data will be wiped.");

    if (!confirmed) return;

    this.stopTimer();

    // Ensuring values are reset to appropriate states
    sharedState.time = 0;
    
    saveState({ time: sharedState.time });

    // Removes all stored values from localStorage as well
    if (localStorage.getItem("lap-results")) {
      localStorage.removeItem("lap-results");
      console.log("storage flushed!");
    }
    
    this.timer.textContent = "00:00:00";
    console.log("resetTimer() executed");
  } 

  refresh() {
    this.stopTimer();

    sharedState.time = 0;
    saveState({ time: sharedState.time });

    this.timer.textContent = "00:00:00";
  }

  timerHandler() {
    // if timer is running, stop it, otherwise start the timer again
    if (sharedState.timerInterval) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  getCurrentTime() {
    console.log(`getCurrentTime(): ${this.timer.textContent}`) 
    if (this.timer) {
      console.log(this.timer.textContent);
      return this.timer.textContent;
    } else {
      return null;
    }
  }

  saveLapOffline(payload) {
    const stored = JSON.parse(localStorage.getItem('lap-results') || '[]');
    stored.push(payload);
    localStorage.setItem('lap-results', JSON.stringify(stored));
  }

  async submitLap() {
    let currentLap = null;

    if (runner && race) currentLap = await fetchCurrentLap(raceId, runner.id);

    const payload = {
      race_id: raceId,
      lap_number: currentLap?.currentLap || null,
      runner_id: runner?.id || null,
      time: this.getCurrentTime()
    }

    if (!runner || !race || !currentLap) {
      this.saveLapOffline(payload);
      return alert("Failed to upload lap, result submitted to Local Storage!");
    }

    try {
      console.log("Payload to be sent: ", JSON.stringify(payload));

      if (!payload.race_id || !payload.lap_number || !payload.runner_id || !payload.time) {
          return alert("Missing Required Fields");
      }

      const response = await fetch('/api/lap-results', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.text();
        return alert(error);
      }

      const result = await response.json();

      console.log(result);

      this.refresh();

      return ("Lap results submitted successfully: ", result);
    } catch (error) {
      this.refresh();


      return alert("Failed to submit, your result is saved to localStorage to be submitted later");
    }
  }
  
  addEventListeners() {
    const startBtn = this.shadowRoot.querySelector('#start-stop');
    const submitBtn = this.shadowRoot.querySelector('#submit-lap');
    const resetBtn = this.shadowRoot.querySelector('#reset');

    startBtn.addEventListener('click', this.timerHandler.bind(this));
    submitBtn.addEventListener('click', this.submitLap.bind(this));
    resetBtn.addEventListener('click', this.resetTimer.bind(this));
  }
}
