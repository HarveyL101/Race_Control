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
      
      
      this.leaderboard = this.shadowRoot.querySelector('#table-body');
      this.lapBtn = this.shadowRoot.querySelector('#lap-end');
      this.refreshBtn = this.shadowRoot.querySelector('#refresh-button');

      loadState();
      this.addEventListeners();
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

    async sendLapResults() {
      sharedState.lapsFinished++;

      try {
        const payload = await JSON.parse(localStorage.getItem('lapResults'));
        console.log("payload to send: ", payload);

        const response = await fetch('api/lap-results', {
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
          console.warn("Failed to post lap results", response);
        }
        const result = await response.json();
        console.log("Response from server: ", result);

      } catch(error) {
        return console.warn("Error 500: Leaderboard Results Not Found: ", error);
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
      this.lapBtn.addEventListener('click', this.sendLapResults.bind(this));

      // being used as a test to see if db is being uploaded to correctly, 
      // (will later be found in the runner version of the timer)
      // below needs to be a getter, whereas above is a post
      // this.refreshBtn.addEventListener('click', this.update.bind(this));      
    }
  }