import { io } from "socket.io-client";

// 개발 서버 주소 (포트 주의!)
const socket = io("http://localhost:4000", {
  transports: ["websocket"],
  autoConnect: false, // 수동 연결
});

export default socket;
