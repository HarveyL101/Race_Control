export class RaceFinder extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        if (!this.shadowRoot.hasChildNodes) {
            this.showRaceFinder();
            console.log("Displaying {RaceFinder}");
        }


    }
    clearAll() {
        this.shadowRoot.innerHTML = '';
    }

    showRaceFinder() {
        this.clearAll();

        
    }
}