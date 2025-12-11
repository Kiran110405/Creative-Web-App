const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
});

const userData = model("user", userSchema);

// Add a user
async function addUser(username, password) {
  const found = await userData.findOne({ username }).exec();
  if (found) return false;

  await userData.create({ username, password });
  return true;
}

// Check login using MongoDB
async function checkUser(username, password) {
  const foundUser = await userData.findOne({ username }).exec();
  if (!foundUser) return false;

  return foundUser.password === password;
}

//this function checks if the user is stored within mongoDB
async function getUser(username, password) {
  const foundUser = await userData.findOne({ username }).exec(); //searches for the user within mongoDB
  if (!foundUser) return null; //checks if the user exists, if it doesnt then it will return null
  if (foundUser.password !== password) return null; //same for the password
  return foundUser; //returns the user if the user is found in the database
}

module.exports = {
  addUser,
  checkUser,
};
