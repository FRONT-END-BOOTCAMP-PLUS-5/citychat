// Socket.io 서버 연동
//서버 시작 파일

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // 개발 중 모든 요청 허용
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`🟢 New client connected: ${socket.id}`);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room: ${roomId}`);
  });

  socket.on("sendMessage", (message) => {
    const { roomId, content } = message;
    console.log(`💬 [${roomId}] ${socket.id}: ${content}`);
    socket.to(roomId).emit("receiveMessage", {
      sender: socket.id,
      content,
    });
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on http://localhost:${PORT}`);
});
