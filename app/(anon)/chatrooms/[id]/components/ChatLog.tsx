"use client";

import { useEffect, useRef, useState } from "react";
import { ChatLogProps } from "../types";
import ChatMessage from "./ChatMessage";
import styles from "./ChatLog.module.css";
import { useUserStore } from "@/app/stores/useUserStore";

export default function ChatLog({
  messages,
  onReply,
  currentUserId,
}: ChatLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [translated, setTranslated] = useState<Record<number, string>>({});
  const [isTranslated, setIsTranslated] = useState<Record<number, boolean>>({});
  const user = useUserStore((state) => state.user);

  // 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTranslateToggle = async (
    messageId: number,
    content: string
  ) => {
    if (isTranslated[messageId]) {
      setIsTranslated((prev) => ({ ...prev, [messageId]: false }));
    } else {
      const targetLang = /[가-힣]/.test(content) ? "en" : "ko";

      try {
        const res = await fetch("/api/chat/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ text: content, targetLang }),
        });

        const data = await res.json();
        setTranslated((prev) => ({ ...prev, [messageId]: data.translation }));
        setIsTranslated((prev) => ({ ...prev, [messageId]: true }));
      } catch (err) {
        console.error("❌ 번역 에러:", err);
      }
    }
  };

  return (
    <div className={styles.container}>
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          msg={msg}
          currentUserId={currentUserId}
          onReply={onReply}
          translated={translated[msg.id!]}
          isTranslated={!!isTranslated[msg.id!]}
          onTranslate={() => handleTranslateToggle(msg.id!, msg.content)}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
