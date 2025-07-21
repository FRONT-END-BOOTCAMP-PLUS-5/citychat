"use client";

import { useParams } from "next/navigation";
import io, { Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { Message, pMessage } from "./types";
import styles from "./page.module.css";
import ChatLog from "./components/ChatLog";
import ChatInput from "./components/ChatInput";
import TopTagList from "../../../components/TopTagList";
import ChatSearch from "./components/ChatSearch";
import ChatRoomInfo from "./components/ChatRoomInfo";
import { useUserStore } from "@/app/stores/useUserStore";

export default function ChatRoom() {
  const params = useParams();
  const roomId = params.id as string;
  const socketRef = useRef<Socket | null>(null);

  const user = useUserStore((state) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [searchResultIds, setSearchResultIds] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

  // 채팅방의 기록(log) 불러오기
  useEffect(() => {
    const fetchInitialMessages = async () => {
      const res = await fetch(`/api/chat/logs?roomId=${roomId}&days=30`, {
        method: "GET",
        credentials: "include",
      });
      const data: Message[] = await res.json();
      setMessages(data);
    };
    fetchInitialMessages();
  }, [roomId]);

  // 채팅 수신
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!, {
      query: { roomId },
    });
    socketRef.current = socket;
    socket.on("receiveMessage", (msg: pMessage) => {
      const mappedMsg: Message = {
        ...msg,
        sentAt: msg.sent_at,
      };
      setMessages((prev) => [...prev, mappedMsg]);
    });
    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  // 채팅 송신
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

  const handleReply = (msg: Message) => {
    setSearchResultIds([]);
    setCurrentSearchIndex(0);
    setReplyTo(msg);
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.searchBox}>
        <ChatSearch
          onSearchStart={() => setReplyTo(null)}
          onSearchResults={(ids) => {
            setSearchResultIds(ids);
            setCurrentSearchIndex(0);
          }}
        />
        <TopTagList
          roomId={Number(roomId)}
          onSearchResults={(ids) => {
            setSearchResultIds(ids);
            setCurrentSearchIndex(0);
            setReplyTo(null);
          }}
        />
      </header>

      <main className={styles.chatRoomContainer}>
        <ChatRoomInfo roomId={roomId} />
        <section className={styles.chatSection}>
          <ChatLog
            messages={messages}
            onReply={handleReply}
            currentUserId={user?.id ?? null}
            searchResultIds={searchResultIds}
            currentIndex={currentSearchIndex}
            onNavigateSearchResult={(direction) => {
              setCurrentSearchIndex((prev) =>
                direction === "prev"
                  ? prev === 0
                    ? searchResultIds.length - 1
                    : prev - 1
                  : prev === searchResultIds.length - 1
                  ? 0
                  : prev + 1
              );
            }}
          />
        </section>
        <footer className={styles.chatInputWrapper}>
          <ChatInput
            onSend={handleSend}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
          />
        </footer>
      </main>
    </div>
  );
}

