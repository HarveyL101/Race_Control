import { sharedState } from "./index.js";

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
      console.log("Displaying: {Leaderboard}");

      this.timer = this.shadowRoot.querySelector('#timer');
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
  
    leaderboardUpdate() {
      runnersFinished++;
      const time = this.timer.textContent || new Date().toISOString();
      const position = runnersFinished;
      
      const runnerData = { position, runner_id, time };
      runnersData.push(runnerData);
  
      
      const li = document.createElement('li');
      const idField = document.createElement('input');
     
      idField.id = `runner-${runnersFinished}`;
      idField.textContent = `${el.timer.textContent}`;
    
      li.appendChild(idField);
      leaderboard.appendChild(li);
    
      console.log(`${idField.id}: ${idField.textContent}`);
    }
  }