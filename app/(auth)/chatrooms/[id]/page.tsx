"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import ChatLog from "./components/ChatLog";
import ChatInput from "./components/ChatInput";

interface Message {
  content: string;
  sender: string;
}

export default function ChatRoom() {
  const params = useParams();
  const roomId = params.id as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<typeof Socket | null>(null);

  // 소켓 연결
  useEffect(() => {
    const socket = io("http://localhost:4000", {
      query: { roomId },
    });

    socketRef.current = socket;

    // 채팅방 입장
    socket.on("connect", () => {
      console.log(`✅ Connected to room ${roomId}`);
    });

    // 서버로부터 메시지를 받았을 때
    socket.on("receiveMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  // 메시지 전송
  const handleSend = (content: string) => {
    const message: Message = {
      content,
      sender: "jihye",
    };
    socketRef.current?.emit("sendMessage", message);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🗨️ Chat Room: {roomId}</h2>
      <ChatLog messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}
