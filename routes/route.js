const path = require("path");
const fs = require("fs");
const express = require("express");

const router = express.Router();

let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

router.get("/api/notes", (req, res) => {
  res.json(notes);
});

router.post("/api/notes", (req, res) => {
  const newNote = req.body;
  notes.push(newNote);
  createDb();
  console.log(`Added new note: ${newNote.title}`);
  res.json(newNote);
});

router.get("/api/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id);
  const note = notes.find((note) => note.id === noteId);
  if (note) {
    res.json(note);
  } else {
    res.status(404).send(`Note with ID ${noteId} not found`);
  }
});

router.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "../assets/notes.html"));
});

router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../assets/index.html"));
});

function createDb() {
  fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), (err) => {
    if (err) throw err;
  });
}

module.exports = router;
