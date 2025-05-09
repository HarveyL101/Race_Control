import path from 'path';
import { fileURLToPath } from 'url';
import initCon from './database/setup.js';
import session from 'express-session';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const permittedTables = ['runners', 'volunteers'];

// global variable for one consistent connection, reduces resource exhaustion
const db = await initCon();

export function isAuthenticated(req, res, next) {
  if (req.session && req.session.loggedIn) {
    next();
  } else {
    res.redirect('/');
  }
}
export async function getCheckpointResults() {

}

export async function postCheckpointResults(req, res) {
const { race_id, lap_number, runner_id, position } = req.body;
}

export async function getRaceResults() {
  const stored = localStorage.getItem('raceResults');

  console.log("getRaceResults(): ", stored);
}

export async function postRaceResults(req, res) {
  const { race_id, runner_id, position, time } = req.body;

  if (!race_id || !runner_id || !position || !time) {
    return res.status(400).send("Error 400: Missing required fields");
  }
  const query = db.prepare(`
    INSERT INTO race_results (race_id, runner_id, position, time)
    VALUES (?, ?, ?, ?)
    `);

  query.run(race_id, runner_id, position, time, function(error) {
    if (error) {
      console.error("Error inserting into DB: ", error)
      return res.status(500).send("Error 500: Internal Server Error")
    }
    res.status(201).json({ 
      message: "Race result saved successfully",
      id: this.runner_id
    })
  });

  query.finalize();
}

// useful middleware for showing requested file routes in the console
export function showFile(req, res, next) {
  console.log(`Request: ${req.method} | ${req.url}`);
  next();
}

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

//needs debugging
async function checkUser(req, res, table, username, password) {
  // debug logs
  console.log("Table:", table);
  console.log("Username:", username);
  console.log("Password:", password);

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