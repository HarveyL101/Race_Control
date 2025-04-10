import path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import fs, { readFile, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const permittedTables = ['runner', 'volunteers'];

async function dbInit(db) {
  try {
    const sql = fs.readFileSync(path.resolve(__dirname, 'database', 'initial.sql'), 'utf-8');
    console.log("Executing SQL from initial.sql:\n", sql);

    const statements = sql.split(';'); // Split SQL statements by semicolon
    for (const statement of statements) {
      if (statement.trim()) { // Skip empty statements
        console.log("Executing statement:", statement.trim());
        await db.exec(statement);
      }
    }

    console.log("The database has been initialized.");
  } catch (error) {
    console.error("Could not initialize database. Error details:", error);
    throw error;
  }
}

/*
// reads the contents of given sql file and executes them 
async function dbInit (db) {
  try {
    const sql = await readFileSync(path.resolve(__dirname, 'database', 'initial.sql'), 'utf-8');
    console.log("Executing SQL from initial.sql:\n", sql);
    await db.exec(sql);
    console.log("The database has been initialised");
  } catch (error) {
    console.log("Could not Intialise database:", error.message);
    throw error;
  }
} */

// function to open a db connection as needed
async function connect() {
  try {
    const db = await open({
      filename: path.resolve(__dirname, 'database', 'race_control.db'),
      driver: sqlite3.Database,
      // To provide additional info when querying/ debugging during development (Remove when development is complete)
      verbose: true
    });
    console.log("DB Connection Established");
    return db;
  } catch (error) {
    console.log("Failed to connect to the database:", error.message);
    throw error;
  }
}

async function initCon() {
  try {
    const db = await connect();
    await dbInit(db);
    return db;
  } catch (error) {
    console.log("Could not initialise and/ or connect to the database:", error.message);
    throw error;
  }
}
// global variable for one consistent connection, reduces resource exhaustion
const dbCon = initCon();
console.log(await dbCon);
// example function to gain understanding of calling to DB
export async function getMessages(table) {
  const db = await dbCon;
  try {
    return db.get('SELECT * FROM ?', table);
  } catch (error) {
    console.log("Error in getMessages");
    res.status(500).send("Internal Server Error: getMessages");
  }
}

// useful middleware for showing file routes through the app
export function showFile(req, res, next) {
  console.log(`Request: ${req.method} | ${req.url}`);
  next();
}



async function getUser(req, res, table, username, password) {
  const db = await dbCon;
  try {
    // validates parameter for security purposes
    if (permittedTables.includes(table)) {
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
      const user = await getUser(req, res, table, username, password);
      return (user ? true : false);
    } catch (error) {
      console.log("[401]Error in checkUser:", error.message);
      return;
    }
  }
}

export async function postLogin(req, res) {
  const db = await dbCon;
  try {
    const { accountType, username, password } = req.body;
    
    // debugging log
    console.log("Form Data Received: ", req.body);
    
    // Validating the accountType
    if (!['runners', 'volunteers'].includes(accountType)) {
      res.send({ message: "Invalid accountType", data: req.body });
      console.log("Invalid accountType", req.body);
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
    const selectedDb = accountType === 'runners' ? 'runners' : 'volunteers';
  
    // Check if user exists in database
    if (await checkUser(req, res, selectedDb, username, password)) {
      console.log(`Successful login, welcome ${username}!`);
      res.redirect('/home.html');
    } else {
      console.log("Invalid username and/ or password");
      res.status(401).send("Invalid Username or Password.");
      return;
    }
  } catch (error) {
    console.log("Error in postLogin: ", error);
    res.status(500).send("Internal Server Error: postLogin");
    return;
  } 
}