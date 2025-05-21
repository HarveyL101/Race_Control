import { Leaderboard, StopWatch } from "./components/util.js";

const submitBtn = document.querySelector('#submit-lap');

customElements.define('leaderboard-panel', Leaderboard);
customElements.define('stopwatch-panel', StopWatch);

const params = new URLSearchParams(window.location.search);
const raceId = Number(params.get('race_id'));

console.log("Race ID received: ", raceId);

function currentTime() {
    const currentTime = document.querySelector('stopwatch-panel');

    const time = currentTime.getCurrentTime();

    console.log("current time: ", time);

    return time;
}

async function fetchCurrentUser() {
    try {
        const response = await fetch('/api/current-user', {
            credentials: 'include'
        });

        const data = await response.json();

        console.log("user details: ", data);
        
        return {
            id: data.id,
            username: data.username
        };
    } catch (error) {
        console.error("Failed to fetch user details: ", error);
    }
}

async function fetchRaceDetails() {
    const response = await fetch(`/api/load-race/${raceId}`, {
        credentials: 'include'
    });
    const data = await response.json();

    console.log("race details: ", data);
    return {
        id: raceId,
        name: data.race_name,
        date: data.race_date,
        startTime: data.start_time,
        lapDistance: data.lap_distance,
        interval: data.interval,
        location: data.location
    };
}

async function fetchCurrentLap(runnerId) {
  try {

    if (!raceId || isNaN(raceId)) {
      console.error("Invalid raceId detected: ", raceId);
      alert("Invalid or missing raceId");
    }
    if(!runnerId || isNaN(runnerId)) {
      console.error("Invalid runnerId detected: ", runnerId);
      alert("Invalid or missing runnerId");
    }

    const response = await fetch(`/api/current-lap?race_id=${raceId}&runner_id=${runnerId}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      const msg = await response.text()
      console.log("fetching current lap failed: ", response.status, msg);
      return null;
    }

    const data = await response.json();
    console.log("data returned: ", data);

    return { currentLap: data.currentLap };
  } catch (error) {
    console.log("Could not fetch current lap: ", error);
  }   
}

async function submitLap() {
    const runner = await fetchCurrentUser();
    const race = await fetchRaceDetails();
    const currentLap = await fetchCurrentLap(raceId, runner.id);

    if (!runner || !race || !currentLap) {
      return alert("Missing Required fields: {runner, race, currentLap}");
    }

    const payload = {
        race_id: race.id,
        lap_number: currentLap.currentLap,
        runner_id: runner.id,
        time: currentTime(),
    }

    try {
        console.log("Payload to be sent: ", JSON.stringify(payload));

        if (!payload.race_id || !payload.lap_number || !payload.runner_id || !payload.time) {
            return alert("Missing Required Fields");
        }

        const response = await fetch('/api/lap-results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const error = await response.text();
          return alert(error);
        }

        const result = await response.json();

        console.log(result);

        return ("Lap results submitted successfully: ", result);
    } catch (error) {
        console.log("Could not post results: ", error);
    }
}

submitBtn.addEventListener('click', submitLap);