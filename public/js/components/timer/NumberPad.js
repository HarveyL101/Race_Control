
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

      this.addEventListeners();
    }
  
    // Loops through the various NumberPad buttons to assign the listeners to allow handlePreview to function
    addEventListeners() {
      const numButtons = this.shadowRoot.querySelectorAll('.num-pad-btn');
      numButtons.forEach(button => {
        button.addEventListener('click', this.handlePreview.bind(this));
      });
    }

    // placeholder value needs to be updated with an actual value
    get RaceID() {
      const race_id = 101;
      
      return race_id;
    }

    get LapCount() { 
      console.log("placeholder");
    }
    
    get RunnerID() {
      const preview = this.shadowRoot.querySelector('#preview');
      const number = Number(preview.textContent.trim());

      if (!preview || !preview.textContent) {
        console.warn("Preview is either empty or not found");
        return null;
      }
      
      if (String(number)[0] === "0") {
        alert("Please try again: Runner Id's cannot begin with zero :/");
        return null;
      }

      return isNaN(number) ? null : number;
    }

    get Position() {
      console.log("placeholder");
    }

    get Time() {
      const stopwatch = document.querySelector('stopwatch-panel');

      const result = stopwatch.getCurrentTime();

      return result;
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
      const lapCount = Number(this.LapCount); // placeholder
      const runner_id = this.RunnerID; // needs error handling on empty input
      const position = Number(this.Position); // position working
      const time = this.Time; // time working

      // 'register' log to account for each part of the raceResult entry
      console.log(`
        Race ID: ${raceId}\n
        Lap Count: ${lapCount}\n
        Runner ID: ${runner_id}\n
        Position: ${position}\n
        Time: ${time}\n
      `);

      if (!raceId || !lapCount || !runner_id || !position || !time) {
        alert(`
        You are missing required fields: \n
        Race ID: ${raceId}\n
        Lap Count: ${lapCount}\n
        Runner ID: ${runner_id}\n
        Position: ${position}\n
        Time: ${time}\n
        `)
      }
      
      const result = this.createLapResult(raceId, lapCount, runner_id, position, time);

      return result;
    }

    // WIP, needs to send the current previewField.value to the relevant position on leaderboard
    submitRunner() {
      const data = this.prepareSubmit();

      // Get current values from localStorage or start with an empty array
      const existingStorage = JSON.parse(localStorage.getItem("lapResults") || "[]");
      
      existingStorage.push(data);

      // Store newly appended array
      localStorage.setItem("lapResults", JSON.stringify(existingStorage));

      console.log("Current array in localStorage.lapResults: ", existingStorage);
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
            this.submitRunner();
            // Unicode for the No-Break Space (&nbsp) used in preview.textContent 
            this.previewField.textContent = '\u00A0';
            break;
        default:
            this.appendPreview(value); 
            break;
        }
    }
}