import { NumberPad } from "./components/NumberPad.js";
import { Leaderboard } from "./components/Leaderboard.js";
import { StopWatch } from "./components/StopWatch.js";
//import { NumberPad, Leaderboard, StopWatch } from './components/index.js';

customElements.define('number-pad', NumberPad);
customElements.define('leaderboard-panel', Leaderboard);
customElements.define('stopwatch-panel', StopWatch);


