import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 8080;

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
// creating instance of express server
const app = express();

// example db
const users = {name: placeholder}

app.use((req, res, next) => {
  console.log(`Serving: ${req.url}`);
  next();
});

// serves files from the webpages & src directory
app.use(express.static(path.resolve(__dirname, './webpages')));
app.use(express.static(path.resolve(__dirname,'./src')));

app.get('/', (req, res) => {
  res.send("Welcome to my web app!");
})
app.listen(PORT, () => {
  console.log("Listening on port 8080 @http://localhost:8080");
});




