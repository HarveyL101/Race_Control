import { connect } from './database/setup.js';

// global variable for one consistent connection, reduces resource exhaustion
const db = await connect();

export function generateSessionId() {
  return ("session" + "_" + Math.random().toString(16).slice(2));
}

export function parseCookies(req) {
  const fetched = req.headers.cookie?.split("; ") || []; // Optional chaining to avoid premature error throws
  const cookies = {};

  fetched.forEach(cookie => {
    const [name, value] = cookie.split("=");
    cookies[name] = decodeURIComponent(value);
  });

  console.log(cookies);
  return cookies;
}

export function createSession(req, res) {
  // create session and assign user to that id
}

export function sessionCleaner() {
  db.run(`
    DELETE 
    FROM sessions
    WHERE EXPIRES_AT < CURRENT_TIMESTAMP;
  `)
}

// Handlers for '/api/find-race' endpoint
// {
export async function getRaces(req, res) {
  console.log("getRaces()");
}

export async function postRace(req, res) {
  
}
// }

// Handlers for '/api/lap-results' endpoint
// {
export async function getLapResults(req, res) {
  console.log("getLapResults()");

  try {
    const query = await db.all(`
      SELECT
        lap_results.position, 
        runners.username,
        lap_results.time
      FROM lap_results
      JOIN runners ON lap_results.runner_id = runners.id
      ORDER BY lap_results.position ASC
    `);

    console.log("getLapResults(): Success!");

    return res.json(query);
  } catch(error) {
    console.log("getLapResults(): Failed", error);
    return res.status(500).send("Error 500: Lap Results Not Found.");
  }
}

export async function postLapResults(req, res) {
  // required fields: race_id, lap_number, runner_id, position, time
  console.log("postLapResults()");

  const lapResults = req.body;
  
  if (!Array.isArray(lapResults) || lapResults.length === 0) {
    return res.status(400).json({ 
      message: "Error 400: Missing required fields",
      received: lapResults
    });
  }

  try {
    await db.run(`
      INSERT INTO lap_results (race_id, lap_number, runner_id, position, time)
      VALUES (?, ?, ?, ?, ?)`,
      [race_id, lap_number, runner_id, position, time]
    );
    // Confirmation of success
    return res.status(201).json({ 
      message: "Lap entry saved successfully",
      received: lapResults,
      id: runner_id
    });
  } catch(error) {
    console.log("Error inserting into DB: ", error);
    return res.status(500).send("Error 500: Internal Server Error");
  }
}
// }

// Handlers for '/api/race-results' endpoint
// {
  export async function getRaceResults(req, res) {
    const stored = localStorage.getItem('raceResults');
  
    console.log("getRaceResults(): ", stored);
  }
  
  export async function postRaceResults(req, res) {
    const { race_id, runner_id, position, time } = req.body;
  
    if (!race_id || !runner_id || !position || !time) {
      return res.status(400).send("Error 400: Missing required fields");
    }

    try {
      await db.run(`
        INSERT INTO race_results (race_id, runner_id, position, time)
        VALUES (?, ?, ?, ?)`,
        [race_id, runner_id, position, time]
      );

      res.status(201).send("Status 201: Entry Insertion Successful!");
    } catch(error) {
      console.error("Error inserting into DB: ", error)
      return res.status(500).send("Error 500: Internal Server Error");
    }
  }
// }


// Prints the request type and url in the console (useful for debugging)
export function showFile(req, res, next) {
  console.log(`Request: ${req.method} | ${req.url}`);
  next();
}

// LOGIN RELATED CODE
// {
async function isAdmin(username) {
  try { // checks if 'is_admin' === 1 or 0
    const result = await db.run(`
      SELECT is_admin
      FROM users
      WHERE username= ?`,
      [username]
  );

    return result;
  } catch (error) {
    console.log("Error 500: Internal Server Error", error)
    return res.status(500).send("Error 500: Internal Server Error", error);
  }
}

async function getUser(username) {
  try {
    console.log("Value passed to table: ", table);

    const result = await db.run(`
      SELECT username 
      FROM user 
      WHERE username= ?`, 
      [username]
    );

    return result;
  } catch (error) {
    console.log("[500]Error in getUser:", error.message);
    return;
  }
}

async function checkUser(username) {
  try {
    // getUser only returns an exact match, otherwise user will be null
    const user = await getUser(username);

    return (user ? true : false);
  } catch (error) {
    console.log("[401]Error in checkUser:", error.message);
    return;
  }
  
}


export function handleLogin() {
  
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await checkUser(req, res, username, password);

    // debugging log
    console.log("Form Data Received: ", req.body);

    // Validating the username/ password
    if (!username || !password) {
      alert("Invalid Username/ Password", req.body);
      res.send({ message: "Invalid Username/ Password", data: req.body });
      return;
    }
    // (debug) verifying accountType working as intended
    console.log("Account Type:" , accountType);

    // Check if user exists in database
    if (user) {
      console.log(`Successful login, welcome ${username}!`);
      req.session.loggedIn = true;
      req.session.username = username;
      req.session.isAdmin = isAdmin();
      r
      res.redirect(`/home`);
    } else {
      alert("Invalid username and/ or password");
      res.redirect('/');
      return;
    }
  } catch (error) {
    console.log("Error in postLogin: ", error);
    res.status(500).send("Internal Server Error: postLogin");
    return;
  } 
}

export async function register(req, res) {
  try {
    const { username, password } = req.body;

    const user = await checkUser(username);

    if (!user) {
      await db.run(`
        INSERT INTO users (username, password)
        VALUES (?, ?)`,
        [username, password]
      );

      res.status(201).send("Registry was successful.");
    } else {
      alert("Sorry! An account with this username already exists, please try again.");
      res.status(409).send("An account with this username already exists :/");

      return res.redirect('/');
    }
  } catch (error) {
    res.status(500).send("Internal Server Error: ", error);

    return res.redirect('/');
  }
}
// }