import express from 'express';
import path from 'path';
// creating instance of express server
const app = express();

// serves files from the webpages directory
app.use(express.static('webpages'));


app.listen(8080, () => {
  console.log("Listening on port 8080 @http://localhost:8080");
});


