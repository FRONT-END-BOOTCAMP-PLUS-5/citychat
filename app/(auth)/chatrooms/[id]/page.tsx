"use client";

import { useEffect } from "react";
import io from "socket.io-client";

export default function ChatRoom({ params }: { params: { id: string } }) {
  const roomId = params.id;

  useEffect(() => {
    // socket 연결
    const socket = io("http://localhost:4000", {
      query: { roomId },
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("receiveMessage", (msg: string) => {
      console.log("📩 Received message:", msg);
    });

    return () => {
      socket.disconnect();
      console.log("❌ Socket disconnected");
    };
  }, [roomId]);

  return (
    <div>
      <h1>Chat Room ID: {roomId}</h1>
      <p>Check console to verify socket connection</p>
    </div>
  );
}
