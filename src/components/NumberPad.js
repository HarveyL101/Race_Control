import { sharedState } from "./index.js";
// NUMBER PAD CLASS COMPONENTS
export class NumberPad extends HTMLElement {
    constructor() {
      super();
  
      this.attachShadow({ mode: "open" });
    }
  
    connectedCallback() {
      // prevents duplicate templates and other bugs previously experienced
      if (!this.shadowRoot.hasChildNodes()) {
        this.showNumPad();
        console.log("Displaying: {NumberPad}")
      }
      // assigns preview field now that the shadowDOM has been rendered
      this.previewField = this.shadowRoot.querySelector('#preview');

      this.addEventListeners()
    }
  
    // Loops through the various NumberPad buttons to assign the listeners to allow handlePreview to function
    addEventListeners() {
      const numButtons = this.shadowRoot.querySelectorAll('.num-pad-btn');
      numButtons.forEach(button => {
        button.addEventListener('click', this.handlePreview.bind(this));
      });
    }
  
    // Clears the shadowDOM of this custom element only
    clearAll() {
      this.shadowRoot.innerHTML = '';
    }
    // Simple getter for the num-pad-template contents
    get numPadContent() {
      return document.querySelector('#number-pad-template').content.cloneNode(true);
    }
  
    // Adds template to the newly created ShadowDOM
    showNumPad() {
      this.clearAll();
      this.shadowRoot.appendChild(this.numPadContent);
    }
  
    // Slices last element from the previewField's current values
    deductPreview(event) {
      if (this.previewField) {
        this.previewField.textContent = this.previewField.textContent.slice(0, -1);
      }
    }
    
    get raceID() {
      const race_id = 101;
      console.log(race_id);
      return race_id;
    }
    
    get runnerID() {
      const number = Number(this.shadowRoot.querySelector('#preview').textContent);
      console.log(number);
      return number;
    }

    get position() {
      const position = sharedState.runnersFinished;

      return position;
    }

    get time() {

      // Allows  access to the StopWatch shadowDOM
      const stopwatch = document.querySelector.apply('number-pad');
      const timer = stopwatch.shadowRoot.querySelector('#timer');

      console.log(timer.textContent);

      return timer.textContent;
    }
    createRaceResult(race_id, runner_id, position, time) {
      const newTime = new Date().toISOString();
      return {
        race_id: String(race_id),
        runner_id: String(runner_id),
        position: String(position),
        time: time ? time : newTime
      }
    }
    prepareSubmit() {
      const raceId = this.raceID;
      const runner_id = this.runnerID;
      const position = this.position;
      const time = this.time;
      
      const result = createRaceResult(raceId, runner_id, position, time);

      return result;
    }

    // WIP, needs to send the current previewField.value to the relevant position on leaderboard
    submitPreview(race_id, runner_id, position, time) {
      const dataSet = [
        {race_id: "101", runner_id: "118", position: "1", time: new Date()},
      ];
      dataSet.push(this.prepareSubmit());
      console.log(dataSet);
    }
  
    // Adding function, handles empty input fields as well
    appendPreview(value) {
      if (this.previewField) {
        this.previewField.textContent += value;
      } else {
        this.previewField.textContent = value;
      }
    }
    // Calls the necessary function depending on the element that called the listener (e.g. 'add', 'backspace', 'submit')
    handlePreview(event) {
    // Storing in a 'data-value' made it much easier to access values throughout this process
        const value = event.currentTarget.getAttribute('data-value');

        switch (value) {
        case 'backspace':
            this.deductPreview(event);
            break;
        case 'enter':
            this.submitPreview();
            break;
        default:
            this.appendPreview(value); 
            break;
        }
    }
}  
