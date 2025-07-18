"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import ChatLog from "./components/ChatLog";
import ChatInput from "./components/ChatInput";
import { Message } from "./types";
import { useUserStore } from "@/app/stores/useUserStore";
import ChatSearch from "./components/ChatSearch";
import styles from "./page.module.css";

export default function ChatRoom() {
  const params = useParams();
  const roomId = params.id as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const user = useUserStore((state) => state.user);
  const [searchResultIds, setSearchResultIds] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

  // ✅ 기존 채팅 불러오기 (로그 초기 로딩)
  useEffect(() => {
    const fetchInitialMessages = async () => {
      const res = await fetch(`/api/chat/logs?roomId=${roomId}&days=30`, {
        method: "GET",
        credentials: "include",
      });
      const data: Message[] = await res.json();
      setMessages(data);
      console.log("data", data);
    };

    fetchInitialMessages();
  }, [roomId]);

  // ✅ 소켓 연결
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!, {
      query: { roomId },
    });

    socketRef.current = socket;
    socket.on("connect", () => {});

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
      sentAt: new Date().toISOString(),
    };
    socketRef.current?.emit("sendMessage", message);
  };

  // ✅ 답장 시작 시 검색 초기화
  const handleReply = (msg: Message) => {
    setSearchResultIds([]);
    setCurrentSearchIndex(0);
    setReplyTo(msg);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBox}>
        <ChatSearch
          onSearchStart={() => {
            setReplyTo(null); // 검색 시작 시 답장 초기화
          }}
          onSearchResults={(ids) => {
            setSearchResultIds(ids);
            setCurrentSearchIndex(0);
          }}
        />
      </div>
      <div className={styles.chatRoomContainer}>
        <div className={styles.chatSection}>
          <ChatLog
            messages={messages}
            onReply={handleReply}
            currentUserId={user?.id ?? null}
            searchResultIds={searchResultIds}
            currentIndex={currentSearchIndex}
            onNavigateSearchResult={(direction) => {
              setCurrentSearchIndex((prev) => {
                if (direction === "prev") {
                  return prev === 0 ? searchResultIds.length - 1 : prev - 1;
                } else {
                  return prev === searchResultIds.length - 1 ? 0 : prev + 1;
                }
              });
            }}
          />
        </div>
      </div>
      <div className={styles.chatInputWrapper}>
        <ChatInput
          onSend={handleSend}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
        />
      </div>
    </div>
  );
}

