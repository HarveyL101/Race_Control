// NUMBER PAD CLASS COMPONENTS
class NumberPad extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // prevents duplicate templates and other bugs previously experienced
    if (!this.shadowRoot.hasChildNodes()) {
      this.showNumPad();
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
  // WIP, needs to send the current previewField.value to the relevant position on leaderboard
  submitPreview() {
    console.log("Number Submitted!");
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

// LEADERBOARD CLASS COMPONENTS
class Leaderboard extends HTMLElement {
  constructor() {
    super(); 

    const shadwRoot = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    if (this.shadowRoot.hasChildNodes) {

    }
  }
  clearAll() {
    this.shadowRoot.innerHTML = '';
  }
}
customElements.define('number-pad', NumberPad);


let time = 0,
  timerInterval = null,
  runnersFinished = 0;

const timer = document.querySelector('#timer'),
  startBtn = document.querySelector('#start-stop'),
  resetBtn = document.querySelector('#reset'),
  leaderboard = document.querySelector('#leaderboard-list');

function startTimer() {
  startBtn.textContent = "Stop"

  timerInterval = setInterval(() => {
    time++;

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    //formats time values into appropriate format of 'HH:MM:SS'
    timer.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, 1000);
  
  console.log("startTimer() executed");
}

function stopTimer() {
  startBtn.textContent = "Start"

  //stops timer from running and resets timerInterval to allow play-pause-play 
  clearInterval(timerInterval);
  timerInterval = null;

  console.log("stopTimer() executed");
}

function resetTimer() {
  timerInterval = null;
  time = 0;
  runnersFinished = 0;
  startBtn.textContent = "Start";

  //same as stopTimer() but resets time to base values
  clearInterval(timerInterval);
  
  while(leaderboard.firstChild) {
    leaderboard.removeChild(leaderboard.firstChild);
  }

  timer.textContent = "00:00:00";
  console.log("resetTimer() executed");
}

function leaderboardUpdate() {
  runnersFinished++;
  const time = timer.textContent;

  const li = document.createElement('li');
  const idField = document.createElement('input');
  li.id = `runner-${runnersFinished}`;
  li.textContent = `${timer.textContent}`;

  leaderboard.appendChild(li);

  console.log(`${li.id}: ${li.textContent}`);
}

function timerHandler() {
  // if timer is running, stop it, otherwise start the timer again
  if (timerInterval) {
    stopTimer();
  } else {
    startTimer();
  }
}