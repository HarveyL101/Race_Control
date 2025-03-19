import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
// creating instance of express server
const app = express();

app.use((req, res, next) => {
  console.log(`Serving: ${req.url}`);
  next();
});

// serves files from the webpages & src directory
app.use(express.static(path.resolve(__dirname, './webpages')));
app.use(express.static(path.resolve(__dirname,'./src')));

app.listen(8080, () => {
  console.log("Listening on port 8080 @http://localhost:8080");
});




