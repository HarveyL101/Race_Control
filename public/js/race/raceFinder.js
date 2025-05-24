const searchBar = document.querySelector('#search-bar');
const searchBtn = document.querySelector('#search-button');

export async function searchRaces() {
  const query = searchBar.value;

  try {
    const response = await fetch(`/api/find-race?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    console.log(data);

    const container = document.querySelector('#race-options');
    container.innerHTML = '';

    if (!data.races.length) {
      container.innerHTML = '<p>No races found.</p>';
      return;
    }

    data.races.forEach(race => {
      const newDiv = document.createElement('div');
      newDiv.className = 'race';
      newDiv.innerHTML = `
        <div class="race-card">
          <div class="race-header">
            <h3>${race.location}: ${race.name}</h3>
            <p>Id: #${race.id}</p>
          </div>
          <div class="race-content">
            <p>Date: ${race.date}</p>
            <p>Start Time: ${race.start_time}</p>
            <p>Lap Distance: ${race.lap_distance}Km</p>
          </div>
          <div class="race-links">
            <a class="card-button" href="timer.html?race_id=${race.id}"><button>Run This Race</button></a>
            <a class="card-button" href="viewer.html?race_id=${race.id}"><button>Spectate This Race</button></a>
          </div>
        </div>
      `;
      container.appendChild(newDiv);
    })
  } catch(error) {
    console.log("Failed to fetch races: ", error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    
    searchBar.addEventListener('input', searchRaces);
    searchBtn.addEventListener('click', searchRaces);
})