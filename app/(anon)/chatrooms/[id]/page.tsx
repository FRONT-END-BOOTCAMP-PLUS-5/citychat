"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import ChatLog from "./components/ChatLog";
import ChatInput from "./components/ChatInput";
import { Message } from "./types";
import { useUserStore } from "@/app/stores/useUserStore";

export default function ChatRoom() {
  const params = useParams();
  const roomId = params.id as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const user = useUserStore((state) => state.user);

  //✅소켓 연결
  useEffect(() => {
    const socket = io("https://citychat-server-l070.onrender.com", {
      query: { roomId },
    });

    socketRef.current = socket;

    //✅채팅방 입장
    socket.on("connect", () => {
      console.log(`Connected to room ${roomId}`);
    });

    //✅서버로부터 메세지 받기
    socket.on("receiveMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      console.log("서버로부터 받은 메세지:", msg);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  //✅새 메시지 서버에 전송
  const handleSend = (
    content: string,
    tags: string[],
    replyTo?: Message | null
  ) => {
    const message: Message = {
      content,
      tags,
      sender: user?.nickname ?? "",
      senderId: user?.id,
      replyToId: replyTo?.id || null,
    };
    socketRef.current?.emit("sendMessage", message);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🗨️ Chat Room: {roomId}</h2>
      <ChatLog
        messages={messages}
        onReply={setReplyTo}
        currentUserId={user?.id ?? null}
      />
      <ChatInput
        onSend={handleSend}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}
