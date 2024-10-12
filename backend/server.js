const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = {}; // To track connected users

// Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected");

  // Handling joining room
  socket.on("joinRoom", ({ roomName, username }) => {
    const userColor = "#" + Math.floor(Math.random() * 16777215).toString(16); // Random color for the user
    users[socket.id] = { username, userColor };
    socket.join(roomName);
    console.log(`${username} joined room: ${roomName}`);

    io.to(roomName).emit("message", {
      username: "Admin",
      color: "#000000",
      text: `${username} has joined the room.`,
    });
  });

  // Handling sending messages
  socket.on("sendMessage", ({ roomName, message }) => {
    const user = users[socket.id];
    if (user) {
      io.to(roomName).emit("message", {
        username: user.username,
        color: user.userColor,
        text: message,
      });
    }
  });

  // Handling disconnect
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      io.emit("message", {
        username: "Admin",
        color: "#000000",
        text: `${user.username} has left the room.`,
      });
      delete users[socket.id];
    }
    console.log("Client disconnected");
  });
});

// User routes and root
app.use("/api/user", userRoutes);
app.get("/", (req, res) => {
  res.send("API is Running");
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server Started on PORT ${PORT}`));
