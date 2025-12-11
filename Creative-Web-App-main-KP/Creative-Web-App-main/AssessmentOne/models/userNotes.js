const mongoose = require("mongoose"); //import mongoose

const { Schema, model } = mongoose;

const noteSchema = new mongoose.Schema({
  //display data in mongoDB
  userId: { type: String, required: true }, //each user gets to have their own set of notes
  title: { type: String, required: true },
  content: { type: String, required: true },
  // createdAt: { type: Date, default: Date.now }, //automatically gets a time stamp
});

const Note = mongoose.model("Note", noteSchema);

// async function addNote(title, content, username) {
//   let newNote = {
//     title: title,
//     content: content,
//     userId: username,
//   };
//   console.log(newNote);
//   await Note.create(newNote).catch((err) => {
//     console.log("Error",err);
//   });
// }

module.exports = {
  Note
}

/** 
const noteData = model("studentNotes", noteSchema);

async function getNotesByUser(username) {
  notes.find({ username: username });
}


function addNote(title, content, username) {
  let newNote = {
    title: title,
    content: content,
    username: username,
  };
  console.log(newNote);
  noteData.create(newNote).catch((err) => {
    console.log("Error".err);
  });
}


//allows to use this somewhere else in the code
module.exports = mongoose.model("Note", noteSchema, addNote);
  */
