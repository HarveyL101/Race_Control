import { sharedState, loadState } from "../util.js";

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
      loadState();
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