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
      this.lapBtn = this.shadowRoot.querySelector('#lap');

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
      const data = await JSON.parse(localStorage.getItem('lapResults'));

      try {
        const response = await fetch('/api/lap-results', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("Server Response: ", result);

      } catch (error) {
        console.log("Error: Couldnt send lap results to backend");
      }
    }
 
    async leaderboardUpdate() {
      console.log("leaderboardUpdate()");
      try {
        const response = await fetch('/api/lap-results');
        const data = await response.json;

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
      } catch(error) {
        console.log("Error fetching leaderboard results", error);
        return resizeBy.status(500).send("Error 500: Leaderboard Results Not Found.");
      }
    }

    editLeaderboard() {
      console.log("Edit leaderboard");
    }

    addEventListeners() {
      this.lap.addEventListener('click', this.leaderboardUpdate.bind(this));

      // being used as a test to see if db is being uploaded to correctly, 
      // (will later be found in the runner version of the timer)
      window.addEventListener('DOMContentLoaded', this.leaderboardUpdate.bind(this));      
    }
  }