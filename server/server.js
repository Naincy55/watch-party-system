const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// In-memory rooms
const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // JOIN ROOM
  socket.on("join_room", (roomId) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        videoTime: 0,
        isPlaying: false,
      };
    }

    // send state to new user
    socket.emit("sync_state", rooms[roomId]);
  });

  // ▶️ PLAY
  socket.on("play", ({ roomId, time }) => {
    rooms[roomId].isPlaying = true;
    rooms[roomId].videoTime = time;

    socket.to(roomId).emit("play", time);
  });

  // ⏸ PAUSE
  socket.on("pause", ({ roomId, time }) => {
    rooms[roomId].isPlaying = false;
    rooms[roomId].videoTime = time;

    socket.to(roomId).emit("pause", time);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Backend running on port 5000");
});