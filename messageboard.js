
import path from 'path';

// example db for runners and users
const db = {
  runners: [
    {id: 100, username: "adminR", password: "adminPassword"},
    {id: 101, username: "firstUser", password: "userPassword"},
    {id: 102, username: "secondUser", password: "userPassword2"}
  ],
  volunteers: [
    {id: 500, username: "adminV", password: "adminPasswordV"},
    {id: 501, username: "firstVolunteer", password: "volunteerPassword"},
    {id: 502, username: "secondVolunteer", password: "volunteerPassword2"}
  ],
  // example race to further understanding on loading from server
  racers: [
    "John", "John", "John", "John", "John", "John", "John", "There should be seven Johns"
  ]
};

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
      res.redirect('/home.html');
    } else {
      res.status(401).send("Invalid Username or Password.");
      console.log("Invalid username and/ or password");
    }
  } catch (error) {
    console.log("Error in postLogin: ", error);
    res.status(500).send("Internal Server Error");
  }
  
}

export { db };