import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

// Contains all the functionality to read and create the database from the SQL file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// function to read initial.sql file and execute it to create the database
async function dbInit (db) {
    try {
      const sql = readFileSync(path.resolve(__dirname, 'initial.sql'), 'utf-8');
      console.log("Executing SQL from initial.sql:\n", sql);
      await db.exec(sql);
      console.log("The database has been initialised");
    } catch (error) {
      console.log("Could not Intialise database:", error.message);
      throw error;
    }
  }

  // function to open a db connection as needed
async function connect() {
    try {
        const db = await open({
            filename: path.resolve(__dirname, 'race_control.db'),
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

export default async function initCon() {
  try {
    const dbPath = path.resolve(__dirname, 'race_control.db');
    const dbExists = fs.existsSync(dbPath);

    const db = await connect();
  
    if(!dbExists) {
      console.log("Database not found. Initialising schema...");
      await dbInit(db);
    } else {
      console.log("Database found. Skipping schema initialisation");
    }

    return db;
  } catch (error) {
    console.log("Error while verifying database");
    throw error;
  }
  

  return db;
    try {
      const db = await connect();
      await dbInit(db);
      return db;
    } catch (error) {
      console.log("Could not initialise and/ or connect to the database:", error.message);
      throw error;
    }
  }