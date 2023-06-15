// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const notesList = document.getElementById("notes-list");
  const noteTitleInput = document.getElementById("note-title");
  const noteTextInput = document.getElementById("note-text");
  const saveButton = document.getElementById("save-button");

  // Fetch existing notes and render them on the page
  function fetchNotes() {
    // Make an API request to retrieve existing notes
    fetch("/api/notes")
      .then((response) => response.json())
      .then((notes) => {
        // Clear the notes list
        notesList.innerHTML = "";

        // Render each note on the page
        notes.forEach((note) => renderNoteItem(note));
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  }

  // Render a note item on the page
  function renderNoteItem(note) {
    // Create the note item HTML
    const noteItem = document.createElement("li");
    noteItem.classList.add("note-item");
    noteItem.innerHTML = `
        <div class="note-title">${note.title}</div>
        <div class="note-text">${note.text}</div>
      `;

    // Add click event listener to display note details
    noteItem.addEventListener("click", () => {
      displayNoteDetails(note);
    });

    // Append the note item to the notes list
    notesList.appendChild(noteItem);
  }

  // Display note details in the input fields
  function displayNoteDetails(note) {
    noteTitleInput.value = note.title;
    noteTextInput.value = note.text;
  }

  // Save a new note
  function saveNote() {
    const newNote = {
      title: noteTitleInput.value,
      text: noteTextInput.value,
    };

    // Make an API request to save the new note
    fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    })
      .then((response) => response.json())
      .then((savedNote) => {
        // Render the new note on the page
        renderNoteItem(savedNote);

        // Clear the input fields
        noteTitleInput.value = "";
        noteTextInput.value = "";
      })
      .catch((error) => {
        console.error("Error saving note:", error);
      });
  }

  // Event listener for the save button
  saveButton.addEventListener("click", saveNote);

  // Fetch existing notes when the page loads
  fetchNotes();
});
