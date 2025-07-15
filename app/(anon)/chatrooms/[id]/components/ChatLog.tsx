"use client";

import { useEffect, useRef, useState } from "react";
import { ChatLogProps } from "../types";
import { highlightTags } from "./ParseTags";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import styles from "./ChatLog.module.css";

export default function ChatLog({
  messages,
  onReply,
  currentUserId,
}: ChatLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [translated, setTranslated] = useState<Record<number, string>>({});
  const [isTranslated, setIsTranslated] = useState<Record<number, boolean>>({});

  // 번역 버튼 핸들링
  const handleTranslateToggle = async (index: number, content: string) => {
    if (isTranslated[index]) {
      setIsTranslated((prev) => ({ ...prev, [index]: false }));
    } else {
      if (!translated[index]) {
        const targetLang = /[가-힣]/.test(content) ? "en" : "ko";
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: content, targetLang }),
        });
        const data = await res.json();
        setTranslated((prev) => ({ ...prev, [index]: data.translatedText }));
      }
      setIsTranslated((prev) => ({ ...prev, [index]: true }));
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log(currentUserId);
    console.log(messages);
  }, [messages]);

  return (
    <ul className={styles.chatContainer}>
      {messages.map((msg, i) => {
        const isMe = msg.senderId === currentUserId;
        const formattedTime = msg.sent_at
          ? format(new Date(msg.sent_at), "a h:mm", { locale: ko })
          : "";

        const repliedTo = msg.replyToId
          ? messages.find((m) => m.id === msg.replyToId)
          : null;

        return (
          <li key={i} className={styles.messageItem}>
            <span className={styles.sender}>{isMe ? "나" : msg.sender}</span>

            {repliedTo && (
              <div className={styles.replyBox}>
                <div>↪ {repliedTo.sender}</div>
                <div>{repliedTo.content}</div>
              </div>
            )}

            <span
              className={`${styles.messageContent} ${
                isMe ? styles.myMessage : styles.otherMessage
              }`}
              onClick={() => onReply(msg)}
              dangerouslySetInnerHTML={{
                __html: highlightTags(
                  isTranslated[i] && translated[i] ? translated[i] : msg.content
                ),
              }}
            />

            <span className={styles.timestamp}>{formattedTime}</span>

            <button
              onClick={() => handleTranslateToggle(i, msg.content)}
              className={styles.translateButton}
            >
              {isTranslated[i] ? "Original" : "Translate"}
            </button>
          </li>
        );
      })}
      <div ref={bottomRef} />
    </ul>
  );
}
