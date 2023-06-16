const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Serve up index.html as the homescreen
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

// Serve up notes.html when this url is requested
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

// Serve up the db.json file when this url is requested
app.get("/api/notes", (req, res) => {
  // Read the contents of db.json file asynchronously
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8")
    .then((data) => {
      // Parse the JSON data into an array of notes
      const notes = JSON.parse(data);
      // Send the notes as a JSON response
      res.json(notes);
    })
    .catch((err) => console.error(err));
});

// Catch-all to serve up the homescreen for any other urls
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

// Listen for a post to this address
app.post("/api/notes", (req, res) => {
  // Destructure the request body into variables
  const { title, text } = req.body;
  // If the requisite values are received...
  if (title && text) {
    // ...then create a newNote object.
    const newNote = {
      title,
      text,
    };
    // Read the contents of db.json file asynchronously
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8")
      .then((data) => {
        // Parse the JSON data into an array of notes
        const notes = JSON.parse(data);
        // Add the new note to the notes array
        notes.push(newNote);
        // Assign IDs to the notes
        notes.forEach((obj, index) => {
          obj.id = index + 1;
        });
        // Convert the notes array back to JSON
        const notesJson = JSON.stringify(notes, null, 4);
        // Write the updated notes back to db.json file asynchronously
        return fs.writeFile(path.join(__dirname, "./db/db.json"), notesJson);
      })
      .then(() => {
        console.info("Note successfully saved.");
        res.send("Note successfully saved.");
      })
      .catch((err) => console.error(err));
  } else {
    // otherwise, respond with an error
    res.status(500).json("Error occurred while saving the note.");
  }
});

// Listen for a delete request to this address
app.delete("/api/notes/:id", (req, res) => {
  const deleteID = req.params.id;
  // Read the contents of db.json file asynchronously
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8")
    .then((data) => {
      // Parse the JSON data into an array of notes
      const notes = JSON.parse(data);
      // Filter out the note with the specified ID
      const newNotes = notes.filter((obj) => obj.id != deleteID);
      // Re-assign IDs to the remaining notes
      newNotes.forEach((obj, index) => {
        obj.id = index + 1;
      });
      // Convert the updated notes array back to JSON
      const newNotesJson = JSON.stringify(newNotes, null, 4);
      // Write the updated notes back to db.json file asynchronously
      return fs.writeFile(path.join(__dirname, "./db/db.json"), newNotesJson);
    })
    .then(() => {
      console.info("Note successfully deleted.");
      res.send("Note successfully deleted.");
    })
    .catch((err) => console.error(err));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
