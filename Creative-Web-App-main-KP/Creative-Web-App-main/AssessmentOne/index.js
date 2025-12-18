const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const fetch = require("node-fetch"); // needed for OpenAI request
const sessions = require("express-session");
const cookieParser = require("cookie-parser");
//required variables

//for session
const tenMinutes = 10 * 60 * 1000;
const oneHour = 1 * 60 * 60 * 1000;

const mongoDBPassword = process.env.mongoDBPassword;
const mongoDBUsername = process.env.mongoDBUsername;
const mongoDBAppName = process.env.mongoAppName;
//set up for mongoDB

const connectionString = `mongodb+srv://${mongoDBUsername}:${mongoDBPassword}@cluster0.lpfnqqx.mongodb.net/${mongoDBAppName}?retryWrites=true&w=majority`;

mongoose.connect(connectionString);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Needed for the chatbot API

const users = require("./models/users");
//const userNotes = require("./models/users");
const Notes = require("./models/userNotes");
const Note = Notes.Note;
const { request } = require("http");
const Event = require("./models/eventCalender");

//cookies
app.use(
  sessions({
    secret: "This is my secret",
    cookie: { maxAge: tenMinutes },
    resave: false,
    saveUninitialized: false,
  })
);

function checkLoggedIn(request, response, nextAction) {
  if (request.session) {
    if (request.session.username) {
      nextAction();
    } else {
      request.session.destroy();
      response.sendFile(path.join(__dirname, "/views", "notloggedin.html"));
    }
  } else {
    request.session.destroy();
    request.sendFile(path.join(__dirname, "/views", "notloggedin.html"));
  }
}

// Page Routes

app.get("/homepage", checkLoggedIn, (request, response) => {
  response.sendFile(path.join(__dirname, "/views", "homepage.html"));
});

app.get("/map", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "/views", "map.html"));
});

app.get("/notes", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "/views", "notes.html"));
});

app.get("/AI", checkLoggedIn, (request, response) => {
  response.sendFile(path.join(__dirname, "views", "AI.html"));
});

app.get("/calender", checkLoggedIn, (request, response) => {
  response.sendFile(path.join(__dirname, "views", "calender.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "/views", "register.html"));
});

app.post("/register", (req, res) => {
  if (users.addUser(req.body.username, req.body.password)) {
    return res.sendFile(path.join(__dirname, "/views", "login.html"));
  }
  res.sendFile(path.join(__dirname, "/views", "registration_failed.html"));
});

app.get("/profile", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "/views", "profile.html"));
});

app.get("/logout", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "/views", "logout.html"));
});

app.post("/logout", (request, response) => {
  request.session.destroy();
  response.redirect("/");
});

// app.post("/register", (req, res) => {
//   if (users.addUser(req.body.username, req.body.password)) {
//     return res.sendFile(path.join(__dirname, "/public", "login.html"));
//   }
//   res.sendFile(path.join(__dirname, "/public", "registration_failed.html"));
// });

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/views", "login.html"));
});

/** 
app.post("/login", async (request, response) => {
  if (await userModel.checkUser(request.body.username, request.body.password)) {
    request.session.username = request.body.username;
    response.sendFile(path.join(__dirname, "/views", "app.html"));
  } else {
    response.sendFile(path.join(__dirname, "/views", "notloggedin.html"));
  }
});
*/

// app.post("/login", async (req, res) => {
//   const user = await users.checkUser(req.body.username, req.body.password);

//   if (user) {
//     res.json({ success: true, userId: user._id });
//     // res.redirect("notes.html");
//   } else {
//     res.json({ success: false });
//   }

//   if (await userModel.checkUser(request.body.username, request.body.password)) {
//     request.session.username = request.body.username;
//     response.sendFile(path.join(__dirname, "/views", "homepage.html"));
//   } else {
//     response.sendFile(path.join(__dirname, "/views", "notloggedin.html"));
//   }
// });

app.post("/login", async (req, res) => {
  const user = await users.checkUser(req.body.username, req.body.password);

  if (user) {
    //store session (needed for checkLoggedIn)
    req.session.username = req.body.username;
    req.session.userId = user._id;

    return res.json({
      success: true,
      userId: user._id,
      username: user.username,
    });

    // redirect to homepage
    //return res.redirect("/homepage");
  } else {
    return res.sendFile(path.join(__dirname, "/views", "notloggedin.html"));
  }
});

//sends messages to openAIs API and gets responses
app.post("/api/chat", async (req, res) => {
  //sends a post request when a user asks a question
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      //endpoint
      method: "POST", //tells open API that user is sending data to it
      headers: {
        "Content-Type": "application/json", //informs that we are sending the data in json format
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful study assistant." }, //how the AI should act
          { role: "user", content: userMessage },
        ],
        max_tokens: 120, //maximum response length
        temperature: 0.3, // strictness
      }),
    });

    const data = await response.json();

    const botReply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response."; //if model doesnt have a response in its array it returns this

    res.json({ reply: botReply });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ reply: "Server error. Try again later." });
  }
});

app.get("/user/notes/:userId", async (req, res) => {
  //gets notes belonging to a specific user that has signed into the app
  try {
    const notes = await Note.find({ userId: req.params.userId }).sort({
      createdAt: 1,
    }); //finding the notes that belong to the user that is logged in and displays them in order from oldest to newest
    res.json(notes); //sends the notes back to the user in a json format
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.post("/user/notes", async (req, res) => {
  console.log("recieved note post");
  try {
    // let note=await Notes.addNote(req.body.title, req.body.content, req.body.userId)
    const note = await Note.create({
      userId: req.body.userId,
      username: req.body.username,
      title: req.body.title,
      content: req.body.content,
    });

    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

/** 
app.post("/api/notes", async (req, res) => {
  //creating a new note object
  console.log("got note");
  Note.addNote(
    request.body.noteTitle,
    request.body.noteContent,
    request.session.username
  );
  response.sendFIle(path.join(__dirname, "/views", "notes.html"));
});

*/

app.put("/user/notes/:id", async (req, res) => {
  //app.put updates the exisiting data that the user already has
  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id, //this is the ID of the note that is being updated via URL
      {
        title: req.body.title,
        content: req.body.content,
      },
      { new: true }
    );

    res.json(updated); //sends updated note to the user in json format
  } catch (err) {
    //this code runs if somethig goes wrong
    res.status(500), json({ error: err });
  }
});

app.delete("/user/notes/:id", async (req, res) => {
  //app.delete is a delete request by the user
  try {
    await Note.findByIdAndDelete(req.params.id); //reads the ID from URL and tries to find same ID in mongo, and will delete that note if it is found
    res.json({ success: true }); //sends them a JSON response back if the deletion worked
  } catch (err) {
    res.status(500), json({ error: err });
  }
});
//Calender routes

app.post("/api/events", async (req, res) => {
  const { userId, title, detail, date } = req.body;

  const newEvent = await Event.create({
    userId: req.session.userId,
    title,
    detail,
    date,
  });
  res.json({ success: true, event: newEvent });
});

//gets all events for the user
app.get("/api/events/:userId", async (req, res) => {
  const events = await Event.find({ userId: req.session.userId });
  res.json(events);
});

//Delete route to delete the events
app.delete("/api/events/:eventId", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.eventId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: error });
  }
});

// //logout

// app.get("/logout", checkLoggedIn, (request, response) => {
//   response.sendFile(path.join(__dirname, "/public", "logout.html"));
// });

// app.post("/logout", (request, response) => {
//   request.session.destroy();
//   response.redirect("/");
// });

//calender APIKey
// app.get("/api/geoapify-key", (req, res) => {
//   res.json({ apiKey: process.env.GEOAPIFY_API_KEY });
// });

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
