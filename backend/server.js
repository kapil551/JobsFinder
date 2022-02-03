const express = require("express");
const dotenv = require('dotenv');
const colors = require('colors')

const { chats } = require("./data/data");
const connectDB = require("./config/db");

// connect backend to frontend
/*
    If we try to make an API call from our frontend to backend, it is going to give us a cors error.
    And If we want to avoid that cors error we need to provide the proxy to our fontend app.
*/

const app = express();
dotenv.config();
connectDB();

// GET --> '/'
app.get("/", (req, res) => {
  res.send("API is running");
});

// GET --> '/api/chat'
app.get("/api/chat", (req, res) => {
  res.send(chats);
});

// GET -->
app.get("/api/chat/:id", (req, res) => {
  //console.log(req.params.id);

  const singleChat = chats.find((chat) => chat._id === req.params.id);
  res.send(singleChat);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server started...".yellow.bold);
});
