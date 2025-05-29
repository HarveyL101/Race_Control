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
            <h3><b>${race.location}:</b> ${race.name}</h3>
            <p><b>Id:</b> #${race.id}</p>
          </div>
          <div class="race-content">
            <p><b>Date:</b> ${race.date}</p>
            <p><b>Start Time:</b> ${race.start_time}</p>
            <p><b>Lap Distance:</b> ${race.lap_distance}Km</p>
          </div>
          <div class="race-links">
            <a class="card-button" href="/timer?race_id=${race.id}"><button><b>Run This Race</b></button></a>
            <a class="card-button" href="/viewer?race_id=${race.id}"><button><b>Spectate This Race</b></button></a>
          </div>
        </div>
      `;
      container.appendChild(newDiv);
    })
  } catch(error) {
    console.log("Failed to fetch races: ", error);
  }
}

function addEventListeners() {
  searchBar.addEventListener('input', searchRaces);
  searchBtn.addEventListener('click', searchRaces);
}

addEventListeners();