/** 
let notes = []; //array for the notes
let editingNoteId = null;

async function loadNotesFromDB() {
  //gets the notes from mongoDB
  const userId = localStorage.getItem("loggedInUser"); //retrieving stored userId from local storage

  //gets specific notes from the backend and renders it to the front end
  const res = await fetch(`/api/notes/${userId}`); //getting the users notes from the backend and hits the "app.get" in index.js
  notes = await res.json();
  if (!Array.isArray(notes)) notes = []; //makes sure "notes" is always an array
  renderNotes(); //this renders the notes to the HTML for the user to see
}

async function saveNote(event) {
  event.preventDefault(); //doesnt cause a refresh and loose the data in the modal/dialog so will still be there

  const title = document.getElementById("noteTitle").value.trim(); //gets value written in this ID and saves it
  const content = document.getElementById("noteContent").value.trim(); //trim to get rid of white space
  const userId = localStorage.getItem("loggedInUser");

  let savedNote;

  if (editingNoteId) {
    const updatedNote = { title, content };

    const res = await fetch(`/api/notes/${editingNoteId}`, {
      //browser sends HTTP request to the server and "Await" waits for the server to respond
      method: "PUT", //PUT is updating the existing data
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedNote),
    });

    savedNote = await res.json();

    //update notes array
    const index = notes.findIndex((n) => n._id === editingNoteId); //(n) => n._id === editingNoteId checks the notes ID and the ID of the note that is currently being edited
    if (index !== -1) notes[index] = savedNote; //goes to the note in the postion of the array that it was found and switches it out for the new updated note
  } else {
    //add new note
    const res = await fetch("/api/notes", {
      //triggers the app.post backend route
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        title,
        content,
      }),
    });

    const data = await res.json();
    savedNote = data.note;
    notes.unshift(savedNote); //add to the top of the notes
  }

  closeNoteDialog();
  renderNotes(); //dont have to refresh the page to see the new notes does it automatically
  editingNoteId = null;
} //function adds all the saved notes to the notes array

function generateId() {
  return Date.now().toString(); //converts Date.now into a string
} //returns current time stamp as a string

async function saveNotesToDB(note) {
  const userId = localStorage.getItem("loggedInUser"); //gets the user ID from the browser and esnures that the notes are saved under the correct user

  return fetch("/api/notes", {
    method: "POST", //server recieves this post request in the index.js folder "app.post"
    headers: {
      "Content-Type": "application/json",
    },
    //converting the note to JSON so it can be sent back to the user so that the user can understand in strings
    body: JSON.stringify({
      userId,
      title: note.title,
      content: note.content,
    }),
  });
}

async function deleteNote(noteId) {
  //noteId is the id of the note that i want to delete
  await fetch(`/api/notes/${noteId}`, {
    method: "DELETE", //method DELETE tells the backend server to run the DELETE request for the note that has been selected
  });
  notes = notes.filter((n) => n._id !== noteId);
  renderNotes();
}
//Displays the notes written onto the screen

function renderNotes() {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = notes
    .map(
      (note) => `
    <div class="note-card">
    <h3 class="note-title">${note.title}</h3>
    <p class="note-content">${note.content}</p>
    <div class="note actions">
    <button class="edit-btn" onclick="openNoteDialog('${note._id}')" title="Edit Note">
    <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.03 
            0-1.42l-2.34-2.34a1 1 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
    </svg>
    </button>
    <button class="delete-btn" onclick="deleteNote('${note._id}')" title="delete Note">
      <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
    </button>
    </div>
    </div>
    `
    ) //creates a div, subheading and text for each note to display then
    .join("");
} //notes.map allows execution for very note in the array

function openNoteDialog(noteId = null) {
  //opens modal and the following Ids
  const dialog = document.getElementById("noteDialog");
  const titleInput = document.getElementById("noteTitle");
  const contentInput = document.getElementById("noteContent");

  if (noteId) {
    //edit mode
    const noteToEdit = notes.find((note) => note._id === noteId); //finds the note that you want to edit and find the note with the same ID as note.id
    editingNoteId = noteId;
    document.getElementById("dialogTitle").textContent = "Edit Note";
    titleInput.value = noteToEdit.title;
    contentInput.value = noteToEdit.content;
  } else {
    //add mode
    editingNoteId = null; //set to null because not editing a note ID but creating a new one
    document.getElementById("dialogTitle").textContent = "Add New Note";
    titleInput.value = "";
    contentInput.value = "";
  } //else statement handles what the model will look like

  dialog.showModal(); //will open up dialog element(const dialog)
}

function closeNoteDialog() {
  document.getElementById("noteDialog").close();
} //closes modal and the following Ids

document.addEventListener("DOMContentLoaded", function () {
  //waits until HTML page is fully loaded
  loadNotesFromDB(); //gets the notes from mongoDB
  document.getElementById("noteForm").addEventListener("submit", saveNote); //when the note is 'submitted the note is now saved as"saveNote" is the function to save it

  const dialog = document.getElementById("noteDialog");

  dialog.addEventListener("click", function (event) {
    const dialogContent = document.querySelector(".dialog-content");

    if (!dialogContent.contains(event.target)) {
      closeNoteDialog();
    }
  });
}); //called on every refresh on the page
*/
