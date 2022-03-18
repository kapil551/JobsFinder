const express = require("express");
const dotenv = require('dotenv');
const colors = require('colors')

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require("./routes/chatRoutes");

//middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

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

app.use(express.json()); // to tell the server to accept JSON data from the frontend

app.use('/api/user', userRoutes);
app.use("/api/chat", chatRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server started...".yellow.bold);
});
