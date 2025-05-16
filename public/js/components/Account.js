// Will contain the handler functions for the Account html section 
export class Account extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({ mode: "open" });
    }
    
    clearAll() {
        this.shadowRoot.innerHTML = '';
    }

    get content() {
        return document.querySelector('#account-template').content.cloneNode(true);
    }

    showAccount() {
        this.clearAll();
        this.shadowRoot.appendChild(this.content);
    }
}