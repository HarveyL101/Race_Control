import { fetchCurrentUser } from "/js/functions/fetch.js";

export class Admin extends HTMLElement {
  constructor() {
      super();

      this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this.shadowRoot.hasChildNodes()) {
        this.checkAdmin();
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

    this.queryBtn = this.shadowRoot.querySelector('#query-button');
    this.inputField = this.shadowRoot.querySelector('#text-input');
    this.outputField = this.shadowRoot.querySelector('#text-output');

    this.addEventListeners();
  }

  async checkAdmin() {
    const user = await fetchCurrentUser();

    if (user.isAdmin === 1) {
      this.showAdmin();
      console.log("Displaying {Admin}");
    } else {
      console.log("User is not admin, admin panel hidden");
    }
  }

  async runQuery(query) {

    if (!query) {
      alert("Missing Required Fields: please input a query first");
      return;
    }
    const payload = { query };

    try {
      const response = await fetch('/api/query-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        this.outputField.value = data.message || "Query failed, check syntax and try again.";
        return;
      }

      
      this.outputField.value = JSON.stringify(data.result, null, 2);
      this.inputField.value = '';
    } catch (error) {
      return alert("Invalid query, please check your syntax and try again");
    } 
  }

  addEventListeners() {
    this.queryBtn.addEventListener('click', () => {
      const query = this.inputField.value;
      this.runQuery(query);
    });
  }
}