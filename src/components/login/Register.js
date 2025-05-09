export class Register extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {

        if (!this.shadowRoot.hasChildNodes) {
            this.showRegister();
        }
    }

    clearAll() {
        this.shadowRoot.innerHTML = '';
    }
    
    get registerContent() {
        return document.querySelector('register-template').content.cloneNode(true);
    }
    showregister() {
        this.clearAll();
        this.shadowRoot.appendChild(this.registerContent);
        console.log("Displaying {Login}");
    }

}