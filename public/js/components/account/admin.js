export class Admin extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
    }

    connectedtCallback() {
        if (!this.shadowRoot.hasChildNodes) {
            this.showAdmin();
        }

        this.addEventListeners();
    }

    clearAll() {
        this.shadowRoot.innerHTML = '';
    }

    get adminContent() {
        return document.querySelector('#admin-template').content.cloneNode(true);
    }

    showAdmin() {
        this.clearAll();
        this.shadowRoot.appendChild(this.adminContent);

        console.log("Displaying {Admin}");
    }
}