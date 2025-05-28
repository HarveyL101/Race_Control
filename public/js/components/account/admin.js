export class Admin extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        if (!this.shadowRoot.hasChildNodes()) {
            this.showAdmin();
        }
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