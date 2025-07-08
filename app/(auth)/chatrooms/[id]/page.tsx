"use client";

import { useParams } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import ChatLog from "./components/ChatLog";
import ChatInput from "./components/ChatInput";
import { ChatReply } from "./components/ChatReply";

interface Message {
  content: string;
  tags?: string[];
  sender: string;
  replyTo?: string;
}
interface ChatReplyProps {
  msg: Message;
  onCancel: () => void;
}

export default function ChatRoom() {
  const params = useParams();
  const roomId = params.id as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [isSending, setIsSending] = useState(false);
  const socketRef = useRef<Socket | null>(null);

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

  //새 메시지 서버에 전송
  const handleSend = (
    content: string,
    tags: string[],
    replyTo?: Message | null
  ) => {
    if (isSending) return;
    const message: Message = {
      content,
      tags,
      sender: "jihye",
      replyTo: replyTo ? replyTo.content : undefined,
    };
    socketRef.current?.emit("sendMessage", message);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🗨️ Chat Room: {roomId}</h2>
      <ChatLog messages={messages} onReply={setReplyTo} />
      <ChatInput
        onSend={handleSend}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}
