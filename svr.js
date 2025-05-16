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


app.use(session({
  randId: mb.generateSessionId(),
  secret: 'n0_p33k1ng_(MM4OQuMZ7OmzrYk)',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Middleware that logs the method and url of a request
app.use(mb.showFile);
app.use(mb.sessionHandler);

// serves files from /views, /src and /css
app.use(express.static(path.resolve(__dirname, 'views')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/imgs', express.static(path.join(__dirname, 'public/imgs')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));


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

// Routes for the /webpages directory
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'views/index.html'));
});

app.get('/home', (req, res) => {
  if (!req.user) {
    return res.status(401).send("Unauthorised");
  }
  res.sendFile(path.resolve(__dirname, 'views/home.html'));
});

app.get('/placeholder', (req, res) => {
  if (!req.user) {
    return res.status(401).send("Unauthorised");
  }
  res.sendFile(path.resolve(__dirname, 'views/placeholder.html'));
});


// Some admin handlers
app.post('/admin/give-admin', (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).send("Access denied, you cannot do this with your current priveledges");
  }

  // call giveAdmin() function (WIP)
});

app.post('/login', mb.login);
app.post('/register', mb.register);

// handlers for the current lap/ checkpoint being recorded
app.get('/api/lap-results', mb.getLapResults);
app.post('/api/lap-results', mb.postLapResults);
// handlers for the race-results displayed on the leaderboard
app.get('/api/race-results', mb.getRaceResults);
app.post('api/race-results', mb.postRaceResults);
// handlers for searching for a race in find-race
app.get('/api/find-race', mb.getRaces);
app.post('/api/find-race', mb.postRace);

// Handler for 404 error codes
app.use((req, res, next) => {
  res.status(404).send("Error Code 404: Page not found");
  next();
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}, @http://localhost:${PORT}`);
});

setInterval(() => {
  mb.sessionCleaner();
}, 3600000) // One hour (in milliseconds)




