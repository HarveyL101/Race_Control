import { connect } from './database/setup.js';

// global variable for one consistent connection, reduces resource exhaustion
const db = await connect();


// Prints the request type and url in the console (useful for debugging)
export function showFileStream(req, res, next) {
  console.log(`Request: ${req.method} | ${req.url}`);
  next();
}

// authentication for /api endpoints
export function apiAuth(req, res, next) {
  if (req.session && req.session.userId) {
    console.log("User: ", req.session.userId);
    return next();
  } else {
    return res.status(401).json({ error: "Not authenticated" });
  }
}

// authentication for HTML page routes
export function htmlAuth(req, res, next) {
  if (req.session && req.session.userId) {
    console.log("User: ", req.session.userId);
    return next();
  } else {
    return res.redirect('/');
  }
}

// Handlers for '/api/find-race' endpoint
// {
export async function searchRaces(req, res) {
  const query = req.query.q || '';

  try {
    const races = await db.all(`
      SELECT 
        r.id AS id,
        r.name AS name,
        r.date AS date,
        r.start_time AS start_time,
        r.distance AS lap_distance,
        l.name AS location
      FROM 
        races r
      JOIN locations l ON r.location_id = l.id
      WHERE r.name LIKE ? OR l.name LIKE ?
      ORDER BY l.name, r.name ASC`,
    [`%${query}%`, `%${query}%`]
    );

    res.status(200).json({ races });
  } catch (error) {
    console.log("Internal Server Error: ", error);
  }
}

// Handlers for '/api/load-race' endpoint
// {
export async function loadRace(req, res) {
  const raceId = req.params.id;

  try {
    const race = await db.get(`
      SELECT 
        r.id AS id,
        r.name AS name,
        r.date AS date,
        r.start_time AS start_time,
        r.distance AS lap_distance,
        r.interval AS interval,
        l.name AS location       
      FROM 
        races r
      JOIN locations l ON r.location_id = l.id
      WHERE r.id= ?`, 
      [raceId]
    );

    return res.json({
      id: race.id,
      name: race.name,
      date: race.date,
      start_time: race.start_time,
      distance: race.lap_distance,
      interval: race.interval,
      location: race.location
    });
  } catch (error) {
    return res.status(500).json({
      message: `Could not load race ID(#${raceId})`,
      received: req.params
    });
  }
}
// }

// Handlers for '/api/current-user' endpoint
export async function getCurrentUser(req, res) {
  const userId = req.session.userId;
  console.log(userId);

  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const user = await db.get(`
      SELECT 
        id,
        username,
        is_admin
      FROM 
        users
      WHERE 
        id= ?`, 
      [userId]
    );

    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }

    return res.json({ 
      id: user.id, 
      username: user.username,
      isAdmin: user.is_admin
    });
  } catch(error) {
    console.log("Failed to retrieve user details: ", error);
    return res.status(500).json({ message: "Server Error" });
  }
}

// Handlers for '/api/current-lap' endpoint
// {
export async function getCurrentLap(req, res) {
  const { race_id, runner_id } = req.query
  console.log("getCurrentLap: ", { race_id, runner_id });

  try {
    const data = await db.get(`
      SELECT 
        COUNT(*) AS laps_finished
      FROM 
        lap_results
      WHERE 
        race_id= ? AND runner_id= ?`,
      [race_id, runner_id]
    );
    
    console.log("laps finished: ", data.laps_finished);

    const currentLap = data.laps_finished + 1;
    return res.json({ currentLap })
  } catch(error) {
    return res.status(500).json({
      message: "Could not find the current lap for this user",
      id: runner_id
    });
  }
}
// }

// Handler for '/api/query-database'
export async function queryDB(req, res) {
  const naughtyWords = ["delete", "drop", "alter"];

  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ message: "Please enter your query" });
  }

  // blocks dangerous queries
  const trimmed = String(query).trim().toLowerCase();
  for (const entry of naughtyWords) {
    if (trimmed.startsWith(entry)) {
      return res.status(403).json({ message: `Queries containing '${entry}' are forbidden in this portal` });
    }
  }

  try {
    const result = await db.all(query);
    console.log(result);
    return res.json({ result });
  } catch (error) {
    return res.status(400).json({
      message: "Error running your query",
      error: error.message
    });
  }
}

// Handler for '/api/change-password'

export async function changePassword(req, res) {
  const { username, old_password, new_password } = req.body;

  if (!username || !old_password || !new_password) {
    return res.status(400).json({ 
      message: "Error 400: Missing required fields",
      received: req.body
    });
  }

  const result = await checkUser(req, res, username, old_password);

  if (!result) {
    return res.status(404).json({
      message: "User details not found",
      received: result
    });
  }

  try {
    await db.run(`
      UPDATE 
        users
      SET 
        password=?
      WHERE
        username=? AND password=?`,
      [new_password, username, old_password]
    ); 

    return res.status(200).json({ message: "Password Updated Successfully" })
  } catch (error) {
    console.log("Could not update password");

    return res.status(500).json({
      message: "Internal Server Error",
      error: error
    });
  }
}

// Handlers for '/api/lap-results' endpoint
// {
export async function getLapResults(req, res) {
  const raceId = req.params.id;

  try {
    const laps = await db.all(`
      SELECT 
        lr.lap_number,
        u.username AS runner_username,
        lr.time AS lap_time
      FROM 
        lap_results lr
      JOIN
        users u ON lr.runner_id = u.id
      WHERE 
        lr.race_id= ?
      ORDER BY 
        lr.lap_number ASC,
        lr.time ASC`,
      [raceId]
    ); 

    return res.json({ laps });
  } catch (error) {
    console.log("Could not fetch lap results for this race: ", error);

    return res.status(500).json({
      message: "Internal Server Error:",
      received: req.body
    });
  }
}

export async function postLapResults(req, res) {
  console.log("postLapResults()");

  const { race_id, lap_number, runner_id, time } = req.body;
  
  if (!race_id || !lap_number || !runner_id || !time) {
    return res.status(400).json({ 
      message: "Error 400: Missing required fields",
      received: req.body
    });
  }

  try {
    await db.run(`
      INSERT INTO lap_results (race_id, lap_number, runner_id, time)
      VALUES (?, ?, ?, ?)`,
      [race_id, lap_number, runner_id, time]
    );
    // Confirmation of success
    return res.status(201).json({ 
      message: "Lap entry saved successfully",
      received: req.body,
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




// LOGIN RELATED CODE
// {

async function getUser(username, password) {
  try {
    const result = await db.get(`
      SELECT 
        username, password 
      FROM 
        users 
      WHERE 
        username= ? AND password= ?`, 
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

async function checkUsername(req, res, username) {
  const usernameExists = await db.get(`
    SELECT 
      username
    FROM 
      users
    WHERE username= ?`, 
    [username]
  );

  return (usernameExists ? true : false);
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Validating the username/ password
    if (!username || !password) {
      return res.send({ message: "Invalid Username/ Password", data: req.body });
    }

    const isUser = await checkUser(req, res, username, password);

    // debugging log
    console.log("Form Data Received: ", req.body);

    // Check if user exists in database
    if (isUser) {
      console.log(`Successful login, welcome ${username}!`);
      
      // returns desired values for session storage
      const userRow = await db.get(`SELECT id FROM users WHERE username= ?`, [username]);

      req.session.userId = userRow.id;
      req.session.username = userRow.username;

      req.session.save(err => {
        if (err) {
          console.error("Session save error:", err);
        }
        res.redirect('/home');
      });
    } else {
      console.warn("Invalid username and/ or password");
      return res.redirect('/');
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

    const usernameTaken = await checkUsername(username);

    // debugging log
    console.log("Form Data Received: ", req.body);

    // Insert user details into db if not already present
    if (!usernameTaken) {
      await db.run(`
        INSERT INTO users (username, password, is_admin)
        VALUES (?, ?, 0)`,
        [username, password]
      );

      // returns desired values for session storage
      const userRow = await db.get(`SELECT id FROM users WHERE username= ?`, [username]);
      
      req.session.userId = userRow.id;
      req.session.username = userRow.username;

      req.session.save(err => {
        if (err) {
          console.log("Session save error: ", err);
        }
        res.redirect('/home');
      });
    } else {
      console.warn("Sorry! An account with this username already exists, please try again.");
      return res.redirect('/');
    }
  } catch (error) {
    console.log("Error(500): ", error);

    return res.status(500).json ({
      message: "Internal Server Error",
      error: error
    });
  }
}
// }