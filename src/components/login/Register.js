export class Register extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.showRegister();
    }

    clearAll() {
        this.shadowRoot.innerHTML = '';
    }
    
    get registerContent() {
        const template = document.querySelector('#register-template')
        return template.content.cloneNode(true);
    }

    showRegister() {
        this.shadowRoot.appendChild(this.registerContent);

        console.log("Displaying {Register}");

    }
}