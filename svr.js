import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as mb from './messageboard.js';
import session from 'express-session';
import bodyParser from 'body-parser';
import { URL } from 'url';
import connectSqlite3 from 'connect-sqlite3';

const SQLiteStore = connectSqlite3(session);


// creating instance of express server, other global variables stored here
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 8080;
const ONE_DAY = 1000 * 60 * 60 * 24;

app.use(session({
  store: new SQLiteStore({
    db: 'sessions.db',
    dir: path.resolve(__dirname, 'database'),
    createDirIfNotExists: true
  }),
  secret: 'n0_p33k1ng_(MM4OQuMZ7OmzrYk)',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: ONE_DAY
   }
}));

// Middleware that logs the method and url of a request (useful during development)
app.use(mb.showFileStream);

// serves files from within the /public directory
app.use(express.static(path.resolve(__dirname, 'views')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/imgs', express.static(path.join(__dirname, 'public/imgs')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/views', express.static(path.join(__dirname, 'public/views')));


app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

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
});



// HTML route handlers 
// {

app.get('/', mb.htmlAuth, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'views/index.html'));
});

app.get('/home', mb.htmlAuth, (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send("Unauthorised");
  }
  res.sendFile(path.resolve(__dirname, 'views/home.html'));
});

app.get('/account', mb.htmlAuth, (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send("Unauthorised");
  }
  res.sendFile(path.resolve(__dirname, 'views/account.html'));
});

app.get('/race-finder', mb.htmlAuth, (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send("Unauthorised");
  }
  res.sendFile(path.resolve(__dirname, 'views/race/race-finder.html'));
});

app.get('/timer', mb.htmlAuth, (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send("Unauthorised");
  }
  res.sendFile(path.resolve(__dirname, 'views/race/timer.html'));
});

// }
// API handlers
// {

app.post('/api/login', mb.login);
app.post('/api/register', mb.register);

// handlers for the lap_results data
app.get('/api/lap-results/:id', mb.apiAuth, mb.getLapResults);
app.post('/api/lap-results', mb.apiAuth, mb.postLapResults);

// handlers for the race-results displayed on the leaderboard
app.get('/api/race-results', mb.apiAuth, mb.getRaceResults);
app.post('/api/race-results', mb.apiAuth, mb.postRaceResults);
// handlers for searching for a race in race-finder
app.get('/api/find-race', mb.apiAuth, mb.searchRaces);

// handlers for retrieving a users details
app.get('/api/current-user', mb.getCurrentUser);

// handlers for loading a selected race
app.get('/api/load-race/:id', mb.apiAuth, mb.loadRace);

app.post('/api/change-password', mb.apiAuth, mb.changePassword);

// handlers for retrieving the current lap of a runner in a race
app.get('/api/current-lap', mb.apiAuth, mb.getCurrentLap);

// }

// handler for 404 error codes
app.use((req, res, next) => {
  res.status(404).send("Error Code 404: Page not found");
  next();
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}, @http://localhost:${PORT}`);
});
