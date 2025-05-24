import { Leaderboard } from "../components/util";
import { fetchRaceDetails } from "../functions/fetch";

customElements.define('leaderboard-panel', Leaderboard);

const params = new URLSearchParams(window.location.search);
const raceId = Number(params.get('race_id'));

console.log("Race Id received: ", raceId);