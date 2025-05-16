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

export async function sessionHandler(req, res, next) {
  try {
    const cookies = parseCookies(req);
    const sessionID = cookies.session_id;

    if (!sessionID) {
      req.user = null;
      return next();
    }

    const sessionExists = await db.get(`
      SELECT *
      FROM sessions
      WHERE id= ? AND expires_at > CURRENT_TIMESTAMP`,
    [sessionID]
  );

  if (!sessionExists) {
    req.user = null;
    return next();
  }

  const user = await db.get(`
    SELECT *
    FROM users
    WHERE id= ?`,
    [sessionExists.user_id]
  );

  req.user = user || null;
  next();
  } catch (error) {
    console.log('Session not found: ', error);
    req.user = null;
    next();
  }
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
  const query = req.query.q || '';

  try {
    const races = await db.all(`
      SELECT *
      FROM races
      WHERE name LIKE ?`,
    [`%${query}%`]
    );

    res.status(200).json({ races });
  } catch (error) {
    console.log("Internal Server Error: ", error);
  }
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
export async function isAdmin(username) {
  try { // checks if 'is_admin' === 1 or 0
    const result = await db.get(`
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

async function getUser(username, password) {
  try {
    const result = await db.get(`
      SELECT username, password 
      FROM users 
      WHERE username= ? AND password= ?`, 
      [username, password]
    );

    return result;
  } catch (error) {
    console.log("[500]Error in getUser:", error.message);
    return;
  }
}

async function checkUser(req, res, username, password) {
  try {
    // getUser only returns an exact match, otherwise user will be null
    const user = await getUser(username, password);

    return (user ? true : false);
  } catch (error) {
    console.log("[401]Error in checkUser:", error.message);
    return;
  }
  
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Validating the username/ password
    if (!username || !password) {
      return res.send({ message: "Invalid Username/ Password", data: req.body });
    }

    const user = await checkUser(req, res, username, password);

    // debugging log
    console.log("Form Data Received: ", req.body);

    // Check if user exists in database
    if (user) {
      console.log(`Successful login, welcome ${username}!`);
      
      // declarations of values to be passed
      const sessionId = generateSessionId();
      const userRow = await db.get(`SELECT id FROM users WHERE username= ?`, [username]);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const userId = userRow.id;
      
      await db.run(`
        INSERT INTO sessions (id, user_id, EXPIRES_AT)
        VALUES (?, ?, ?)`,
      [sessionId, userId, expiresAt]
      );

      res.setHeader('Set-Cookie', `session_id=${sessionId}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`);

      res.redirect(`/home`);
    } else {
      console.warn("Invalid username and/ or password");
      res.redirect('/');
      return;
    }
  } catch (error) {
    console.log("Error in login(): ", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error
    });
    
  } 
}

export async function register(req, res) {
  try {
    const { username, password } = req.body;

    // Validating the username/ password
    if (!username || !password) {
      return res.send({ message: "Invalid Username/ Password", data: req.body });
    }

    const userExists = await checkUser(username, password);

    if (!userExists) {
      await db.run(`
        INSERT INTO users (username, password, is_admin)
        VALUES (?, ?, 0)`,
        [username, password]
      );

      // declarations of values to be passed
      const sessionId = generateSessionId();
      const userId = await db.get(`SELECT id FROM users WHERE username= ?`, [username]);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      await db.run(`
        INSERT INTO sessions (id, user_id, EXPIRES_AT)
        VALUES (?, ?, ?)`,
      [sessionId, userId, expiresAt]
      );

      res.setHeader('Set-Cookie', `session_id=${sessionId}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`);
      
      return res.redirect('/home');
    } else {
      console.log("Sorry! An account with this username already exists, please try again.");

      res.redirect('/');
    }
  } catch (error) {
    console.log("Error(500): ", error);

    return res.redirect('/');
  }
}
// }