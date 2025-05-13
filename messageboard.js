import path from 'path';
import { fileURLToPath } from 'url';
import { connect } from './database/setup.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const permittedTables = ['runners', 'volunteers'];

// global variable for one consistent connection, reduces resource exhaustion
const db = await connect();

export function isAuthenticated(req, res, next) {
  if (req.session && req.session.loggedIn) {
    next();
  } else {
    res.redirect('/');
  }
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

  db.serialize(() => {
    db.run("BEGIN TRANSACTION") // Begins transaction

    const query = db.prepare(`
      INSERT INTO lap_results (race_id, lap_number, runner_id, position, time)
      VALUES (?, ?, ?, ?, ?)
    `);
  
    query.run(race_id, lap_number, runner_id, position, time);

    db.run("COMMIT"); // Finalises transaction on successfull insert
    // Confirmation of success
    return res.status(201).json({ 
      message: "Lap entry saved successfully",
      received: lapResults,
      id: runner_id
    });
  })
  try {
    

  } catch (error) {
    console.log("Error inserting into DB: ", error);
    db.run("ROLLBACK")
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
      const query = await db.prepare(`
        INSERT INTO race_results (race_id, runner_id, position, time)
        VALUES (?, ?, ?, ?)
        `);
    
      const result = await query.run(query, [race_id, runner_id, position, time]);
    
      result.finalize();
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
async function getUser(table, username, password) {
  try {
    console.log("Value passed to table: ", table);
    // validates parameter for security purposes
    if (!permittedTables.includes(table)) {
      throw new Error("[403]Unauthorised Table Name");
    }
    const q = `SELECT username, password FROM ${table} WHERE username= ? AND password= ?`
    return await db.get(q, [username, password]);
  } catch (error) {
    console.log("[500]Error in getUser:", error.message);
    return;
  }
}

async function checkUser(req, res, table, username, password) {

  if (username, password !== null) {
    try {
      // getUser only returns an exact match, otherwise user will be null
      const user = await getUser(table, username, password);
      return (user ? true : false);
    } catch (error) {
      console.log("[401]Error in checkUser:", error.message);
      return;
    }
  }
}

export async function login(req, res) {
  try {
    const { accountType, username, password } = req.body;
    
    // debugging log
    console.log("Form Data Received: ", req.body);
    
    // Validating the accountType
    if (!permittedTables.includes(accountType)) {
      console.log("Invalid accountType", req.body);
      res.send({ message: "Invalid accountType", data: req.body });
      return;
    }
    // Validating the username/ password
    if (!username || !password) {
      console.log("Invalid Username/ Password", req.body);
      res.send({ message: "Invalid Username/ Password", data: req.body });
      return;
    }
    // (debug) verifying accountType working as intended
    console.log("Account Type:" , accountType);

    // selects correct object of database
    const redirectURL = accountType === 'runners' ? 'runner' : 'volunteer';

    // Check if user exists in database
    if (await checkUser(req, res, accountType, username, password)) {
      console.log(`Successful login, welcome ${username}!`);
      req.session.loggedIn = true;
      req.session.username = username;
      res.redirect(`/${redirectURL}/home`);
    } else {
      console.log("Invalid username and/ or password");
      res.redirect('/');
      return;
    }
  } catch (error) {
    console.log("Error in postLogin: ", error);
    res.status(500).send("Internal Server Error: postLogin");
    return;
  } 
}
// }