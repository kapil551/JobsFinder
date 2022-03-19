const express = require("express");
const dotenv = require('dotenv');
const colors = require('colors')

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

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
app.use("/api/message", messageRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`server started on ${PORT}`.yellow.bold);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});