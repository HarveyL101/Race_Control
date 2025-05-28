import { fetchCurrentUser, fetchRaceDetails, fetchLapDetails } from "/js/functions/fetch.js";

const params = new URLSearchParams(window.location.search);
const raceId = Number(params.get('race_id'));

const user = await fetchCurrentUser();
const race = await fetchRaceDetails(raceId);

const el = {
  title: document.querySelector('#page-header'),
  welcomeMsg: document.querySelector('#welcome-msg'),
  container: document.querySelector('#leaderboard-content'),
  refreshBtn: document.querySelector('#refresh-leaderboard')
};

console.log("Race Id received: ", raceId);

el.title.textContent = `We hope you enjoy watching the ${race.name}!`;
el.welcomeMsg.textContent = `Stay hydrated ${user.username}!`;

async function display() {
  const race = await fetchRaceDetails(raceId);
  const data = await fetchLapDetails(raceId);

  console.log("Race: ", race);

  if (!data.length) {
    el.container.innerHTML= '<p>future results will be displayed here...</p>';
  }

  //groups retrieved data into lap_number, allows for easier mapping to unique tables
  const groupedLaps = {};
  data.forEach(( { lap_number, runner_username, lap_time }) => {
    if (!groupedLaps[lap_number]) {
      groupedLaps[lap_number] = [];
    }

    groupedLaps[lap_number].push({runner_username, lap_time });
  });

  const expandedTables = [...el.container.querySelectorAll('details')];
  expandedTables.filter(details => details.open);
  expandedTables.map(details => details.querySelector('summary')?.textContent.trim());

  console.log("groupedLaps: ", groupedLaps);

  el.container.innerHTML = '';

  // defines html table with embedded dynamic fields
  Object.entries(groupedLaps).forEach(([lap_number, results]) => {
    const newDiv = document.createElement('div');
    newDiv.className = 'lap-table';

    const isOpen = expandedTables.includes(`Lap ${lap_number}`);

    newDiv.innerHTML = `
      <details ${isOpen ? 'open' : ''}>
      <summary class="summary-toggle">Lap ${lap_number}</summary>
        <div class="lap-container">
          <h3>Lap ${lap_number} Results:</h3>
          <p><b>(Any missing results may not yet be uploaded)</b></p>
          <table border="1" class="lap-table">
            <thead class="table-header">
              <tr class="header-row">
                <td><b>Position</b></td>
                <td><b>Runner</b></td>
                <td><b>Lap Time (HH:MM:SS)</b></td>
              </tr>
            </thead>
            <tbody class="table-body">
              ${results.map((item, index) => `
                <tr class="data-row">
                  <td>${index + 1}</td>
                  <td>${item.runner_username}</td>
                  <td>${item.lap_time}</td>
                </tr>
              `).join('')}
            </tbody> 
          </table>
        </div>
    </details>
    `;

    
    el.container.appendChild(newDiv);
  });
}

el.refreshBtn.addEventListener('click', display);