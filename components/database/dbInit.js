import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// function to read initial.sql file and execute it to create the database
export async function dbInit (db) {
    try {
      const sql = await readFileSync(path.resolve(__dirname, 'database', 'initial.sql'), 'utf-8');
      console.log("Executing SQL from initial.sql:\n", sql);
      await db.exec(sql);
      console.log("The database has been initialised");
    } catch (error) {
      console.log("Could not Intialise database:", error.message);
      throw error;
    }
  }