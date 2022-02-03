const express = require("express");
const dotenv = require('dotenv');
const colors = require('colors')

const userRoutes = require('./routes/userRoutes');

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

app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server started...".yellow.bold);
});
