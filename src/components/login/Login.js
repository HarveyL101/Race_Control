export class Login extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {

        if (!this.shadowRoot.hasChildNodes) {
            this.showLogin();
        }
    }

    clearAll() {
        this.shadowRoot.innerHTML = '';
    }
    
    get loginContent() {
        return document.querySelector('login-template').content.cloneNode(true);
    }
    showLogin() {
        this.clearAll();
        this.shadowRoot.appendChild(this.loginContent);
        console.log("Displaying {Login}");
    }

}