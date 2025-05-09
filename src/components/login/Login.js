export class Login extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        if (!this.shadowRoot.hasChildNodes()) {
            this.showLogin();
        }
    }

    clearAll() {
        this.shadowRoot.innerHTML = '';
    }
    
    get loginContent() {
        const template = document.querySelector('#login-template')
        return template.content.cloneNode(true);
    }

    addEventListeners() {

        this.runnerCheckbox.addEventListener('change', this.runnerSetup.bind(this));
        this.volunteerCheckbox.addEventListener('change', this.volunteerSetup.bind(this));
    }

    showLogin() {
        this.clearAll();
        this.shadowRoot.appendChild(this.loginContent);

        this.accountType = this.shadowRoot.querySelector('#account-type');
        this.runnerCheckbox = this.shadowRoot.querySelector('#runner-chk');
        this.volunteerCheckbox = this.shadowRoot.querySelector('#volunteer-chk');
        this.loginForm = this.shadowRoot.querySelector('#login-form');

        this.runnerCheckbox.checked = false;
        this.volunteerCheckbox.checked = false;

        this.addEventListeners();

        console.log("Displaying {Login}", this.runnerCheckbox.checked, this.volunteerCheckbox.checked);

    }

    runnerSetup() {
        if (this.runnerCheckbox.checked) {

            this.accountType.value = 'runners';
            this.volunteerCheckbox.checked = false;

            console.log("accountType Value (raw): ", this.accountType.value);
        }
    }

    volunteerSetup() {
        if (this.volunteerCheckbox.checked) {
            
            this.accountType.value = 'volunteers';
            this.runnerCheckbox.checked = false;

            console.log("accountType Value (raw): ", this.accountType.value);
        }
    }
    
    
}