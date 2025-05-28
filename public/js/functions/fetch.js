export async function fetchCurrentUser() {
    try {
      const response = await fetch('/api/current-user', {
        credentials: 'include'
      });

      if (!response.ok) {
        const msg = await response.text();
        console.log("fetching current lap failed: ", response.status, msg);
        return null;
      }

      const data = await response.json();

      return {
        id: data.id,
        username: data.username
      };
    } catch (error) {
      console.error("Failed to fetch user details: ", error);
      return;
    }
}

export async function fetchLapDetails(race_id) {
  try {
    const response = await fetch(`/api/lap-results/${race_id}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      const msg = await response.text();
      console.log("fetching current lap failed: ", response.status, msg);
      return null;
    }
    const data = await response.json();

    return data.laps;
  } catch (error) {
    console.error("Failed to fetch lap details: ", error);
    return null;
  }
  
}

export async function fetchRaceDetails(race_id) {
  try {
    const response = await fetch(`/api/load-race/${race_id}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      const msg = await response.text()
      console.log("fetching current lap failed: ", response.status, msg);
      return null;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Could not fetch race details: ", error);
    return null;
  }
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

    return data.currentLap;
  } catch (error) {
    console.log("Could not fetch current lap: ", error);
  }   
}