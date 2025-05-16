export class Login extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.showLogin();
    }

    clearAll() {
        this.shadowRoot.innerHTML = '';
    }
    
    get loginContent() {
        const template = document.querySelector('#login-template')
        return template.content.cloneNode(true);
    }

    showLogin() {
        this.shadowRoot.appendChild(this.loginContent);

        console.log("Displaying {Login}");

    }
}