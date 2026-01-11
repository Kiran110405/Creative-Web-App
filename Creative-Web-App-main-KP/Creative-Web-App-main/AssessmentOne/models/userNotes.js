const mongoose = require("mongoose"); //import mongoose

const { Schema, model } = mongoose;

const noteSchema = new mongoose.Schema({
  //display data in mongoDB
  userId: { type: String, required: true }, //each user gets to have their own set of notes
  username: { type: String, required: true }, //added for username to be displayed
  title: { type: String, required: true },
  content: { type: String, required: true },
  // createdAt: { type: Date, default: Date.now }, //automatically gets a time stamp
});

const Note = mongoose.model("Note", noteSchema);

module.exports = {
  Note,
};
