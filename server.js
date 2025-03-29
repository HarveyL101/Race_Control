import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 8080;

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
// creating instance of express server
const app = express();

// example db for runners and users
const runners = [
  {id: 100, username: "adminR", password: "adminPassword"},
  {id: 101, username: "firstUser", password: "userPassword"},
  {id: 102, username: "secondUser", password: "userPassword2"}
];
const volunteers = [
  {id: 500, username: "adminV", password: "adminPasswordV"},
  {id: 501, username: "firstVolunteer", password: "volunteerPassword"},
  {id: 502, username: "secondVolunteer", password: "volunteerPassword2"}
]

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use((req, res, next) => {
  console.log(`Serving: ${req.method} | ${req.url}`);
  next();
});

// serves files from the webpages & src directory
app.use(express.static(path.resolve(__dirname, './webpages')));
app.use(express.static(path.resolve(__dirname,'./src')));

function getIndex(req, res) {
  res.sendFile(path.resolve(__dirname, './webpages/index.html'));
}
//needs debugging
function checkUser(database, username, password) {
  for (let user of database) {
    if (user.username === username && user.password === password) {
      console.log("User Found!!");
      return true;
    } else {
      console.log("404: User Not Found");
      return false;
    }
  }
}
function postLogin(req, res) {
  const { accountType, username, password } = req.body;
  
  // debugging log
  console.log("Form Data Received: ", req.body);
  
  if (!['runners', 'volunteers'].includes(accountType)) {
    
    res.send("Invalid accountType", req.body);
    console.log("Invalid accountType", req.body);
  }
  console.log("Account Type:" , accountType);
  const db = accountType === 'runners' ? runners : volunteers;

  // Check if user exists in database
  if (checkUser(db, username, password)) {
    console.log(`Successful login, welcome ${user.username}!`);
    res.redirect('/home.html');
  } else {
    res.status(401).send("Invalid Username or Password.");
    console.log("Invalid username and/ or password");
  }
}

app.get('/', getIndex);
app.post('/login', postLogin)

app.use((req, res) => {
  res.status(404).send("Error Code 404: Page not found");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}, @ http://localhost:${PORT}`);
});




