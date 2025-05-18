import { Leaderboard, StopWatch } from "./components/util.js";
import { sharedState } from "./components/util.js";

customElements.define('leaderboard-panel', Leaderboard);
customElements.define('stopwatch-panel', StopWatch);

let runnerInfo = {
    id: null,
    name: null
};

let raceInfo = {
    id: null,
    name: null,
    date: null,
    startTime: null,
    lapDistance: null,
    location: null
};

const params = new URLSearchParams(window.location.search);
const raceId = params.get('race_id');
const currentLap = sharedState.lapsFinished;

console.log("Race ID received: ", raceId);

async function fetchCurrentUser() {
    try {
        const response = await fetch('/api/current-user', {
            credentials: 'include'
        });
        const data = await response.json();

        console.log(data);
    
        // assignment of data to global object
        runnerInfo.id = data.id;
        runnerInfo.name = data.username;
    
        console.log("Runner Info: ", runnerInfo);
    } catch (error) {
        console.error("Failed to fetch user details: ", error);
    }
}

async function fetchRaceDetails() {
    const response = await fetch(`/api/load-race/${raceId}`);
    const data = await response.json();

    const raceDetails = data.raceDetails;

    // assignment of data to global object
    raceInfo.id = raceDetails.race_id;
    raceInfo.name = raceDetails.race_name;
    raceInfo.date = raceDetails.race_date;
    raceInfo.startTime = raceDetails.start_time;
    raceInfo.lapDistance = raceDetails.lap_distance;
    raceInfo.location = raceDetails.location;

    console.log("Race Info: ", raceInfo);
}

async function submitLap() {

    if (!raceInfo.id || !runnerInfo.id) {
        alert("Missing race/ runner info");
        return;
    }

    const payload = {
        race_id: "placeholder",
        lap_number: "placeholder",
        runner_id: "placeholder",
        time: "placeholder",
    }

    try {
        const response = await fetch('/api/lap-results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = response.json();
        sharedState.lapsFinished++;

        if (!response.ok) {
            alert(`Error: ${response.error || "Could not post your results"}`);
            return;
        }

    } catch (error) {
        console.log("Could not post results: ", error);
    }



    console.log(payload);
}

fetchCurrentUser();
fetchRaceDetails();