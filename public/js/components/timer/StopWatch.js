import { sharedState, saveState } from "../util.js";
import { fetchCurrentUser, fetchRaceDetails, fetchCurrentLap  } from "/js/functions/fetch.js";

const params = new URLSearchParams(window.location.search);
const raceId = Number(params.get('race_id'));

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
    this.timer = this.shadowRoot.querySelector('#timer');
    // info-buttons
    this.infoBtn = this.shadowRoot.querySelector('#info-button');
    this.uploadBtn = this.shadowRoot.querySelector('#upload-button');
    //stopwatch buttons
    this.startBtn = this.shadowRoot.querySelector('#start-stop');
    this.submitBtn = this.shadowRoot.querySelector('#submit-lap');
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
    this.startBtn.textContent = "Start";
  
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

  showButtons() {
    this.submitBtn.hidden = false;
    this.resetBtn.hidden = false;
  }
  hideButtons() {
    this.submitBtn.hidden = true;
    this.resetBtn.hidden = true;
  }

  timerHandler() {
    // if timer is running, stop it, otherwise start the timer again
    // also hides relevant buttons to prevent accidents while running
    if (sharedState.timerInterval) {
      

      this.stopTimer();
    } else {
      this.submitBtn.hidden = true;
      this.resetBtn.hidden = true;

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

  offlineSave(payload) {
    const stored = JSON.parse(localStorage.getItem('lap-results') || '[]');
    stored.push(payload);
    localStorage.setItem('lap-results', JSON.stringify(stored));
  }

  async offlineUpload() {
    const runner = await fetchCurrentUser();
    const race = await fetchRaceDetails(raceId);

    const stored = JSON.parse(localStorage.getItem('lap-results') || '[]');

    if (!runner || !race) {
      return alert("Could not fetch the current user and/ or lap")
    }
    if (!stored.length) {
      return alert("You have no lap results left to submit, best of luck!");
    }

    let accepted = 0;
    let rejected = 0;
    const remainingData = [];

    for (const entry of stored) {
      const currentLap = await fetchCurrentLap(raceId, runner.id);

      const payload = {
        race_id: raceId,
        lap_number: currentLap,
        runner_id: runner.id,
        time: entry.time
      }

      try {
        console.log("payload: ", payload);
        const response = await fetch('/api/lap-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          accepted++;
        } else {
          rejected++;
          remainingData.push(entry);
        }

      } catch (error) {
        failed++;
        remainingData.push(entry);
      }
    }
    localStorage.setItem('lap-results', JSON.stringify(remainingData));

    alert(`Upload complete! View results \n Successful: ${accepted} \n Failed: ${rejected}`);
    this.refresh();
  }

  async submitLap() {
    const runner = await fetchCurrentUser();
    const race = await fetchRaceDetails(raceId);
    let currentLap = null;

    if (runner && race) currentLap = await fetchCurrentLap(raceId, runner.id);

    const payload = {
      race_id: raceId,
      lap_number: currentLap || null,
      runner_id: runner?.id || null,
      time: this.getCurrentTime()
    }

    if (!runner || !race || !currentLap) {
      this.offlineSave(payload);
      this.refresh();

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

  showInfo() {
    alert(`
      Some helpful information you may need :) \n\n
      1. Please make sure to submit any previously saved lap results before submitting fresh results.\n
      2. The button to the right of this icon will upload all of your laps currently stored offline (You will be told if a result is stored offline)\n
      3. this is a placeholder\n
    `);
  }
  
  addEventListeners() {
    this.infoBtn.addEventListener('click', this.showInfo.bind(this));
    this.uploadBtn.addEventListener('click', this.offlineUpload.bind(this));
    this.startBtn.addEventListener('click', this.timerHandler.bind(this));
    this.submitBtn.addEventListener('click', this.submitLap.bind(this));
    this.resetBtn.addEventListener('click', this.resetTimer.bind(this));
  }
}
