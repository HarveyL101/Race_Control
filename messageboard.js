import path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function connect() {
  const db = await open({
    filename: path.resolve(__dirname, 'database', 'initial.sql'),
    driver: sqlite3.Database,
    // To provide additional info when querying/ debugging during development (Remove when development is complete)
    verbose: true
  })
}
const dbCon = connect();

export async function getMessages(table) {
  const db = await dbCon;
  return db.get('SELECT * FROM ?', table);
}

export function showFile(req, res, next) {
  console.log(`Serving: ${req.method} | ${req.url}`);
  next();
}

export function getIndex(req, res) {
  res.sendFile(path.resolve(__dirname, 'webpages/index.html'));
}

//needs debugging
export function checkUser(database, username, password) {
  console.log("Database:", database);
  console.log("Username:", username, "Password:", password)

  for (let user of database) {
    if (user.username === username && user.password === password) {
      console.log("User Found!!");
      return true;
    }
  }
  console.log("Not This One! trying the next...")
  return false;
}

export function postLogin(req, res) {
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
    // verifying accountType working as intended
    console.log("Account Type:" , accountType);

    // selects correct object of database
    const selectedDb = accountType === 'runners' ? db.runners : db.volunteers;
  
    // Check if user exists in database
    if (checkUser(selectedDb, username, password)) {
      console.log(`Successful login, welcome ${username}!`);
      res.redirect('/webpages/home.html');
    } else {
      res.status(401).send("Invalid Username or Password.");
      console.log("Invalid username and/ or password");
    }
  } catch (error) {
    console.log("Error in postLogin: ", error);
    res.status(500).send("Internal Server Error");
  } 
}