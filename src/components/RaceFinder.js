export class RaceFinder extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
    } 

    clearAll() {
        this.shadowRoot.innerHTML = '';
    }

    get content() {
        return document.querySelector('#race-finder-template').content.cloneNode(true);
    }

    showRaceFinder() {
        this.clearAll();
        this.shadowRoot.appendChild(this.content);

        this.viewRaceBtn = document.querySelector('#view-race-button');
        console.log(this.viewRaceBtn);
        this.custContainer = document.querySelector('#custom-element-container');
        console.log(this.custContainer);

        this.viewRaceBtn.addEventListener('click', this.showRaceFinder.bind(this));

        console.log("Displaying {RaceFinder}");
    }
}