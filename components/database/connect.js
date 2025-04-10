// function to open a db connection as needed
export async function connect() {
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