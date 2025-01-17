const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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
    if (!username) {
      username = `Guest_${socket.id.substring(0, 5)}`; // Assign default username if not provided
    }

    // Check if user is already registered
    if (!users[socket.id]) {
      const userColor = "#" + Math.floor(Math.random() * 16777215).toString(16); // Random color for the user
      users[socket.id] = { username, userColor };
      socket.join(roomName);
      console.log(`${username} joined room: ${roomName}`);

      // Emit only one join message
      io.to(roomName).emit("message", {
        username: "Admin",
        color: "#000000",
        text: `${username} has joined the room.`,
      });
    }
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

// Deployment configuration to serve frontend from backend
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running");
  });
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server Started on PORT ${PORT}`));  