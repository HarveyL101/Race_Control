import { sharedState, loadState } from "./util.js";

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

      this.leaderboard = this.shadowRoot.querySelector('#leaderboard-list');
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

    // Pull from local storage and display here?
    leaderboardUpdate() {
      
      console.log("runnersFinished Incremented: ", sharedState.runnersFinished);
  
      // Creating the field to be added
      const li = document.createElement('li');
      const idField = document.createElement('input');
     
      idField.id = `runner-${runnersFinished}`;
      idField.textContent = `${el.timer.textContent}`;
    
      li.appendChild(idField);
      this.leaderboard.appendChild(li);
    
      console.log(`${idField.id}: ${idField.textContent}`);
    }

    editLeaderboard() {
      console.log("Edit leaderboard");
    }

    addEventListeners() {
      this.lap.addEventListener('click', this.leaderboardUpdate.bind(this));
    }
  }