import { RaceFinder, Account } from "./components/util.js";

customElements.define('race-finder-panel', RaceFinder);
customElements.define('account-panel', Account);

const el = {
    container: document.querySelector('#custom-element-container'),
    clearBtn: document.querySelector('#clear-button'),
    viewBtn: document.querySelector('#view-race-button'),
    accountBtn: document.querySelector('#account-button')
};

function clearContainer() {
    el.container.innerHTML = '';
    console.log("container cleared");
}
function render(panel) {
    clearContainer();

    const field = document.createElement(panel);
    
    el.container.appendChild(field.content);
}
function renderRaceFinder() {
    const raceFinder = document.createElement('race-finder-panel');

    clearContainer();

    el.container.appendChild(raceFinder.raceFinderContent);

    console.log("{raceFinder} added");
}

function renderAccount() {
    const account = document.createElement('account-panel');

    clearContainer();

    el.container.appendChild(account.accountContent);

    console.log("{account} added")
}

document.addEventListener('DOMContentLoaded', () => {
    el.clearBtn.addEventListener('click', clearContainer);
    el.viewBtn.addEventListener('click', render('race-finder-panel'));
    el.accountBtn.addEventListener('click', render('account-panel'))
});


