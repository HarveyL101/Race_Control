import { Leaderboard, saveState, StopWatch } from "./components/util.js";
import { sharedState } from "./components/util.js";

const submitBtn = document.querySelector('#submit-lap');

customElements.define('leaderboard-panel', Leaderboard);
customElements.define('stopwatch-panel', StopWatch);

const params = new URLSearchParams(window.location.search);
const raceId = Number(params.get('race_id'));

const currentLap = sharedState.lapsFinished;
const currentTime = document.querySelector('stopwatch-panel').getCurrentTime;

console.log("Race ID received: ", raceId);

async function fetchCurrentUser() {
    try {
        const response = await fetch('/api/current-user', {
            credentials: 'include'
        });

        const data = await response.json();
        
        return {
            id: data.id,
            username: data.username
        };
    } catch (error) {
        console.error("Failed to fetch user details: ", error);
    }
}

async function fetchRaceDetails() {
    const response = await fetch(`/api/load-race/${raceId}`);
    const data = await response.json();

    return {
        id: raceId,
        name: data.race_name,
        date: data.race_date,
        startTime: data.start_time,
        lapDistance: data.lap_distance,
        location: data.location
    };
}

async function submitLap() {
    const runner = await fetchCurrentUser();
    const race = await fetchRaceDetails();

    const payload = {
        race_id: race.id,
        lap_number: currentLap,
        runner_id: runner.id,
        time: currentTime,
    }

    try {
        console.log("Payload to be sent: ", payload);

        if (!payload.race_id || !payload.lap_number || !payload.runner_id || !payload.time) {
            return alert("Missing Required Fields")
        }

        const response = await fetch('/api/lap-results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            alert(`Error: ${response.error || "Could not post your results"}`);
            return;
        }

        const result = response.json();
        
        saveState({lapsFinished: ++currentLap});

        return ("Lap results submitted successfully: ", result);
    } catch (error) {
        console.log("Could not post results: ", error);
    }
    
}

submitBtn.addEventListener('click', submitLap);

fetchCurrentUser();
fetchRaceDetails();