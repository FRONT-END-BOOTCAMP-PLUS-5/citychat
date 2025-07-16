"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import ChatLog from "./components/ChatLog";
import ChatInput from "./components/ChatInput";
import { Message } from "./types";
import { useUserStore } from "@/app/stores/useUserStore";
import ChatSearch from "./components/ChatSearch";

export default function ChatRoom() {
  const params = useParams();
  const roomId = params.id as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const user = useUserStore((state) => state.user);

  // ✅ 기존 채팅 불러오기 (로그 초기 로딩)
  useEffect(() => {
    const fetchInitialMessages = async () => {
      const res = await fetch(`/api/chat/logs?roomId=${roomId}&days=7`, {
        method: "GET",
        credentials: "include",
      });
      const data: Message[] = await res.json();
      setMessages(data);
      console.log("data",data);
    };

    fetchInitialMessages();
  }, [roomId]);

  // ✅ 소켓 연결
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!, {
      query: { roomId },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to socket");
    });

    // ✅ 새 메시지 수신 → 이전 메시지 유지하고 하나만 추가
    socket.on("receiveMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  // ✅ 새 메시지 서버 전송
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
      replyToId: replyTo?.id ?? null,
    };
    socketRef.current?.emit("sendMessage", message);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🗨️ Chat Room: {roomId}</h2>
      <ChatSearch />
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
