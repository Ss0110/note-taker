const express = require("express");
const req = require("express/lib/request");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
// middleware to serve static files
app.use(express.static("public"));
// routes
app.get("/", (req, res) => {
  // logc for homepage route
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", (req, res) => {
  // Logic for notes page route
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", (req, res) => {
  // Logic to read notes from JSON file
  const notes = JSON.parse(fs.readFileSync("db.json", "utf8"));
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  // Logic to create  new note and save to the JSON file
  const newNote = req.body; // Assuming you're using a body parser middleware to parse the request body
  // Generate a unique ID for the new note
  newNote.id = generateUniqueId();
  // Save the new note to the JSON file
  const notes = JSON.parse(fs.readFileSync("db.json", "utf8"));
  notes.push(newNote);
  fs.writeFileSync("db.json", JSON.stringify(notes));
  res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  // Logic to delete a note with the specified ID from the JSON file
  const noteId = req.params.id;
  const notes = JSON.parse(fs.readFileSync("db.json", "utf8"));
  const updatedNotes = notes.filter((note) => note.id !== noteId);
  fs.writeFileSync("db.json", JSON.stringify(updatedNotes));
  res.sendStatus(200);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Function to generate a unique ID for a new note
function generateUniqueId() {
  // Generate a unique ID using a library or algorithm of your choice
  // For simplicity, you can use a timestamp-based approach or a random string generator
  // Make sure the generated ID is unique in your application
  // Return the generated ID
}
