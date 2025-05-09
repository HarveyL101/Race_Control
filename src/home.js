import { RaceFinder } from "./components/util.js";

const el = {
    container: document.querySelector('#custom-element-container'),
    viewBtn: document.querySelector('#view-race-button')
};

function clearContainer() {

    while (el.container.hasChildNodes) {
        el.container.removeChild();

        console.log("Node Removed!");
    }
}

viewBtn.addEventlistener('click', RaceFinder.showRaceFinder);