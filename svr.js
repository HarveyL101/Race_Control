import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as mb from './messageboard.js';
import session from 'express-session';
import bodyParser from 'body-parser';
import { URL } from 'url';


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

// creating instance of express server
const app = express();
const PORT = 8080;

function generateSessionId() {
  const rand = "session" + "_" + Math.random().toString(16).slice(2);
  return rand;
}
app.use(session({
  randId: generateSessionId(),
  secret: 'n0_p33k1ng_(MM4OQuMZ7OmzrYk)',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// serves files from /webpages, /src and /css
app.use(express.static(path.resolve(__dirname, 'webpages')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/css', express.static(path.join(__dirname, 'css')));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Middleware that logs the method and url of a request
app.use(mb.showFile);

// Attempt at preventing open redirects
app.get('/redirect', (req, res) => {
  const inputURL = req.query.url;

  try {
    const parsed = new URL (inputURL, 'http://localhost:8080');

    if (parsed.host !== 'localhost:8080') {
      return res.status(400).send(`This redirect is unsupported: ${inputURL}`);
    }

    return res.redirect(parsed.pathname + parsed.search);
  } catch (error) {
    res.status(400).send(`Invalid url: ${inputURL}`);
  }
})
// Routes for the /runner directory
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'webpages/index.html'));
});
app.get('/runner/home', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'webpages/runner/home.html'));
})
app.get('/runner/view', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'webpages/runner/view.html'));
});

// Routes for the /volunteer directory
app.get('/volunteer/home', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'webpages/volunteer/home.html'));
});
app.get('/volunteer/timer', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'webpages/volunteer/timer.html'));
});


app.post('/login', mb.login);

// WIP => app.get('/home')
app.get('/volunteer/timer', mb.isAuthenticated, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'webpages/volunteer/timer.html'));
});

// handlers for the current lap/ checkpoint being recorded
// handlers for the race-results displayed on the leaderboard
app.get('/api/race-results', mb.getRaceResults);
app.post('/api/race-results', mb.postRaceResults);

// Handler for 404 error codes
app.use((req, res, next) => {
  res.status(404).send("Error Code 404: Page not found");
  next();
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}, @http://localhost:${PORT}`);
});




