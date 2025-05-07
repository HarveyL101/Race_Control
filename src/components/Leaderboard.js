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
      const stopwatch = document.querySelector('stop-watch');
      const timer = stopwatch.shadowRoot.querySelector('#timer');
      console.log(timer);

      sharedState.runnersFinished++;
      console.log("runnersFinished Incremented: ", sharedState.runnersFinished);

      const time = timer.textContent || new Date().toISOString();
      const position = runnersFinished;
  
      // Creating the field to be added
      const li = document.createElement('li');
      const idField = document.createElement('input');
     
      idField.id = `runner-${runnersFinished}`;
      idField.textContent = `${el.timer.textContent}`;
    
      li.appendChild(idField);
      leaderboard.appendChild(li);
    
      console.log(`${idField.id}: ${idField.textContent}`);
    }

    addEventListeners() {
      const lap = stopwatch.shadowRoot.querySelector('#lap');

      lap.addEventListener('click', this.leaderboardUpdate.bind(this));
    }
  }