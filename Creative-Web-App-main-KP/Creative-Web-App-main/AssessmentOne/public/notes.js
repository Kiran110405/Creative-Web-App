let notes = [];
let editingNoteId = null;

document.addEventListener("DOMContentLoaded", loadNotes);

//loads the notes of the logged in user from the data in local storage
async function loadNotes() {
  const userId = localStorage.getItem("loggedInUser");
  if (!userId) return;

  const notesContainer = document.getElementById("notesContainer"); //gets this container via class in html

  const response = await fetch(`/user/notes/${userId}`); //sends request to backend
  const data = await response.json(); //responds in a json format

  notes = data; //stores the retrieved notes in a local variable

  notesContainer.innerHTML = ""; //where the notes will be displayed

  notes.forEach((note) => {
    //goes over each note in the notes array
    const card = document.createElement("div"); //creates new div and gives it the class below
    card.classList.add("note-card");

    card.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>

            <button onclick="openNoteDialog('${note._id}')">Edit</button>
            <button onclick="deleteNote('${note._id}')">Delete</button>
        `;

    notesContainer.appendChild(card); //adds the new note to the notesContainer
  });
}

function openNoteDialog(noteId = null) {
  const dialog = document.getElementById("noteDialog");
  const titleInput = document.getElementById("noteTitle");
  const contentInput = document.getElementById("noteContent");

  if (noteId) {
    const noteToEdit = notes.find((n) => n._id === noteId);
    editingNoteId = noteId;

    document.getElementById("dialogTitle").textContent = "Edit Note";
    titleInput.value = noteToEdit.title;
    contentInput.value = noteToEdit.content;
  } else {
    editingNoteId = null;
    document.getElementById("dialogTitle").textContent = "Add New Note";
    titleInput.value = "";
    contentInput.value = "";
  }

  dialog.showModal();
}

function closeNoteDialog() {
  document.getElementById("noteDialog").close();
}

document.getElementById("noteForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const userId = localStorage.getItem("loggedInUser");
  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;

  const noteData = {
    userId: userId,
    username: localStorage.getItem("username"),
    title: title,
    content: content,
  };

  let response;

  //edit note
  if (editingNoteId) {
    response = await fetch(`/user/notes/${editingNoteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteData),
    });
  } else {
    console.log("posting a new note");
    response = await fetch("/user/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteData),
    });
  }
  closeNoteDialog();
  loadNotes();
});

async function deleteNote(id) {
  await fetch(`/user/notes/${id}`, { method: "DELETE" });
  loadNotes();
}
