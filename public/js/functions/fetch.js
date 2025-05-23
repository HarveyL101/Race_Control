export async function fetchCurrentUser() {
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

export async function fetchRaceDetails(race_id) {
    const response = await fetch(`/api/load-race/${race_id}`, {
        credentials: 'include'
    });
    const data = await response.json();

    console.log("race details: ", data);
    return {
        id: data.id,
        name: data.name,
        date: data.date,
        startTime: data.start_time,
        lapDistance: data.lap_distance,
        interval: data.interval,
        location: data.location
    };
}

export async function fetchCurrentLap(raceId, runnerId) {
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