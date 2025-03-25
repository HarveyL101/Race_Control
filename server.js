import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 8080;

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
// creating instance of express server
const app = express();

// example db
const users = [
  {id: 100, username: "admin", password: "adminPassword"},
  {id: 101, username: "firstUser", password: "userPassword"},
  {id: 102, username: "firstVolunteer", password: "volunteerPassword"}
];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use((req, res, next) => {
  console.log(`Serving: ${req.method} | ${req.url}`);
  next();
});

// serves files from the webpages & src directory
app.use(express.static(path.resolve(__dirname, './webpages')));
app.use(express.static(path.resolve(__dirname,'./src')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './webpages/index.html'));
})

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if user exists in database
  const user = users.find(u => u.username === username && u.password === password); 

  if (user) {
    console.log(`Successful login, welcome ${user.username}!`);
    res.redirect('/home.html');
  } else {
    res.status(401).send("Invalid Username");
  }
  console.log(req.body);
  console.log(res);
  console.log(user);
  console.log(users);
});

app.use((req, res) => {
  res.status(404).send("Error Code 404: Page not found");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}, @ http://localhost:${PORT}`);
});




