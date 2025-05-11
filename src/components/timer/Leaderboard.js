import { sharedState, loadState } from "../util.js";

// LEADERBOARD CLASS COMPONENTS
export class Leaderboard extends HTMLElement {
    constructor() {
      super(); 
  
      this.attachShadow({ mode: "open" });
    }
  
    connectedCallback() {
      if (!this.shadowRoot.hasChildNodes()) {
        this.showLeaderboard();
      }
      
      loadState();

      this.leaderboard = this.shadowRoot.querySelector('#table-body');
      this.lapBtn = this.shadowRoot.querySelector('#lap-end');
      this.refreshBtn = this.shadowRoot.querySelector('#refresh-button');

      console.log("Displaying: {Leaderboard}");
    }
  
    clearAll() {
      this.shadowRoot.innerHTML = '';
    }
  
    get leaderboardContent() {
      return document.querySelector('#leaderboard-template').content.cloneNode(true);
    }
  
    showLeaderboard() {
      this.clearAll();
      this.shadowRoot.appendChild(this.leaderboardContent);
    }

    // placeholder value needs to be updated with an actual value
    get RaceID() {
      const race_id = 101;
      
      return race_id;
    }

    get LapCount() { 
      return sharedState.lapsFinished;
    }
    
    get RunnerID() {
      const preview = this.shadowRoot.querySelector('#preview');

      if (!preview || !preview.textContent) {
        console.warn("Preview is either empty or not found");
        return null;
      }

      const number = Number(preview.textContent.trim());

      return isNaN(number) ? null : number;
    }

    get Position() {
      return sharedState.runnersFinished;
    }

    get Time() {
      const stopwatch = document.querySelector('stopwatch-panel');

      const result = stopwatch.getCurrentTime();

      return result;
    }

    createLapResult(race_id, lapCount, runner_id, position, time) {
      const newTime = new Date().toISOString();

      return {
        race_id: String(race_id),
        lap_number: Number(lapCount),
        runner_id: String(runner_id),
        position: String(position),
        time: time ? time : newTime
      }
    }
    // race_id, position and time currently not functional
    prepareSubmit() {
      const raceId = Number(this.RaceID); // placeholder
      const lapCount = Number(this.LapCount);
      const runner_id = Number(this.RunnerID); // runner_id working
      const position = Number(this.Position); // position working
      const time = this.Time; // still not working

      // 'register' log to account for each part of the raceResult entry
      console.log(`
        Race ID: ${raceId}\n
        Lap Count: ${lapCount}\n
        Runner ID: ${runner_id}\n
        Position: ${position}\n
        Time: ${time}\n
      `);
      
      const result = this.createLapResult(raceId, lapCount, runner_id, position, time);

      return result;
    }

    // WIP, needs to send the current previewField.value to the relevant position on leaderboard
    submitRunner(race_id, runner_id, position, time) {
      sharedState.runnersFinished++;
      
      const data = this.prepareSubmit();

      // Get current values from localStorage or start with an empty array
      const existingStorage = JSON.parse(localStorage.getItem("lapResults") || "[]");
      
      existingStorage.push(data);

      // Store newly appended array
      localStorage.setItem("lapResults", JSON.stringify(existingStorage));

      console.log("Current array in localStorage.lapResults: ", existingStorage);
    }

    async sendLapResults() {
      const payload = await JSON.parse(localStorage.getItem('lapResults'));

      try {
        const response = await fetch('/api/lap-results', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          // On Success - Clear localStorage
          localStorage.removeItem('lapResults');
          console.log("Local Storage Cleared, Lap Results Submitted.");
        } else {
          console.log("Failed to post ap results", response.status);
        }
        const result = await response.json();
        console.log(result);

      } catch(error) {
        console.log("Error fetching leaderboard results", error);
        return console.warn("Error 500: Leaderboard Results Not Found.");
      }
    }

    refresh() {
      const storedData = localStorage.getItem('lapResults');
      const data = JSON.parse(storedData);

      //packages and appends data in localStorage to the leaderboard
      data.forEach(entry => {
        const row = document.createElement('tr');

        const cells = [
          entry.position,
          entry.runner,
          entry.time
        ];

        cells.forEach(entry => {
          const cell = document.createElement('td');
          cell.textContent = entry;
          row.appendChild(cell);
        });

        this.leaderboard.appendChild(row)
      });
    }

    editLeaderboard() {
      console.log("Edit leaderboard");
    }

    addEventListeners() {
      this.refreshBtn.addEventListener('click', this.refresh.bind(this));
      this.lap.addEventListener('click', this.update.bind(this));

      // being used as a test to see if db is being uploaded to correctly, 
      // (will later be found in the runner version of the timer)
      // below needs to be a getter, whereas above is a post
      // this.refreshBtn.addEventListener('click', this.update.bind(this));      
    }
  }