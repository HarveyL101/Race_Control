import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as mb from './messageboard.js';

const PORT = 8080;

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

// creating instance of express server
const app = express();

// serves files from /webpages, /src and /css
app.use(express.static(path.resolve(__dirname, 'webpages')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/css', express.static(path.join(__dirname, 'css')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware that logs the method and url of a request
app.use(mb.showFile);


async function loadMessages() {
  const result = await mb.getMessages(req.params.table);
  if (result) {
    res.json(result)
  } else {
    res.status(404).send("Data Not Found");
  }
  const messageList = document.querySelector('#message-list');
  messageList.textContent = '';
  showMessages(messages, messageList);
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'webpages/index.html'))
});
app.post('/login', mb.postLogin)

// Handler for 404 error codes
app.use((req, res) => {
  res.status(404).send("Error Code 404: Page not found");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}, @ http://localhost:${PORT}`);
});




