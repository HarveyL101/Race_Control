const searchBar = document.querySelector('#search-bar');
const searchBtn = document.querySelector('#search-button')
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
        <h4>${race.location}: ${race.race_name}</h4>
        <p>Date: ${race.race_date}</p>
        <p>Start Time: ${race.start_time}</p>
        <p>Lap Distance: ${race.lap_distance}</p>
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