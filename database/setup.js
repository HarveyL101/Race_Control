import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

// Contains all the functionality to read and create the database from the SQL file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, 'RaceControl.db');
const SQL_PATH = fs.readFileSync(path.resolve(__dirname, 'database.sql'), 'utf-8');

// function to read database.sql file and execute it to create the database
async function dbInit (db) {
    try {
      const sql = SQL_PATH;
      console.log("Executing SQL from database.sql");
      await db.exec(sql);
      console.log("database.sql schema has been initialised");
    } catch (error) {
      console.log("Could not Intialise database: \n");
      throw error;
    }
  }

// function to open a db connection as needed
export async function connect() {
    try {
        const db = await open({
            filename: DB_PATH,
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
    const shouldInit = !fs.existsSync(DB_PATH) || fs.statSync(DB_PATH).size === 0;
    const db = await connect();
  
    if (shouldInit) {
      console.log("Database not found. Initialising schema...");
      await dbInit(db);
    }

    return db;

  } catch(error) {
    console.log("Error while verifying database: ", error.message);
    throw error;
  }
}

initCon();