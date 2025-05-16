const searchBar = document.querySelector('#search-bar');
const searchBtn = document.querySelector('#search-button')
export async function searchRaces() {
  const query = searchBar.value;

  try {
    const response = await fetch(`/api/find-race?q=${encodeURIComponent(query)}`);
    const data = await response.json();

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
        <h3>${race.name}</h3>
        <p><bold>Date:</bold> ${race.date}</p>
        
        <p><bold>Location:</bold> ${race.location_id}</p>
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