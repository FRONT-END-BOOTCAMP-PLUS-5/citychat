import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

// Socket.IO 서버 생성
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Next.js 주소
    methods: ["GET", "POST"],
  },
});

// 소켓 연결 이벤트 핸들링
io.on("connection", (socket) => {
  const roomId = socket.handshake.query.roomId as string;

  // 채팅방 입장
  socket.join(roomId);
  console.log(`✅ User connected to room ${roomId}`);

  // 메시지 수신 처리
  socket.on("sendMessage", (message: string) => {
    console.log(`[${roomId}] New message: ${message}`);

    // 같은 방 사용자들에게 메시지 전송
    io.to(roomId).emit("receiveMessage", message);
  });

  // 연결 종료 시
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected from room ${roomId}`);
  });
});

// 서버 시작
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on http://localhost:${PORT}`);
});
