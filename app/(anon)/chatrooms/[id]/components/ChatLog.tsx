"use client";

import { useEffect, useRef, useState } from "react";
import { ChatLogProps } from "../types";
import { highlightTags } from "./ParseTags";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import styles from "./ChatLog.module.css";

export default function ChatLog({
  messages: incomingMessages,
  onReply,
  currentUserId,
}: ChatLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [renderedMessages, setRenderedMessages] = useState(incomingMessages);
  const [translated, setTranslated] = useState<Record<number, string>>({});
  const [isTranslated, setIsTranslated] = useState<Record<number, boolean>>({});

  // ✅ 새로운 메시지 감지하여 추가
  useEffect(() => {
    if (incomingMessages.length > renderedMessages.length) {
      const newMessages = incomingMessages.slice(renderedMessages.length);
      setRenderedMessages((prev) => [...prev, ...newMessages]);
      console.log("newMessages", newMessages);
    }
  }, [incomingMessages]);

  // ✅ 새 메시지 추가 시 맨 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [renderedMessages]);

  const handleTranslateToggle = async (index: number, content: string) => {
    if (isTranslated[index]) {
      setIsTranslated((prev) => ({ ...prev, [index]: false }));
    } else {
      if (!translated[index]) {
        const targetLang = /[가-힣]/.test(content) ? "en" : "ko";
        const res = await fetch("/api/chat/translate", {
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

  return (
    <ul className={styles.chatContainer}>
      {renderedMessages.map((msg, i) => {
        const isMe = msg.senderId === currentUserId;
        const formattedTime = msg.sentAt
          ? format(new Date(msg.sentAt), "a h:mm", { locale: ko })
          : "";

        const repliedTo = msg.replyToId
          ? renderedMessages.find((m) => m.id === msg.replyToId)
          : null;

        return (
          <li key={msg.id} className={styles.messageItem}>
            <span className={styles.sender}>
              {isMe ? "" : msg.senderNickname}
            </span>

            {repliedTo && (
              <div className={styles.replyBox}>
                <div>↪ {repliedTo.senderNickname}</div>
                <div>{repliedTo.content}</div>
              </div>
            )}

            {/* <span
              className={`${styles.messageContent} ${
                isMe ? styles.myMessage : styles.otherMessage
              }`}
            >
              <span
                onClick={() => onReply(msg)}
                dangerouslySetInnerHTML={{
                  __html: highlightTags(
                    isTranslated[i] && translated[i]
                      ? translated[i]
                      : msg.content
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
            </span> */}
            <div
              key={msg.id}
              className={`${styles.messageWrapper} ${
                isMe ? styles.myWrapper : styles.otherWrapper
              }`}
            >
              {/* ✅ 내 메시지 → 버튼 위쪽 왼쪽에 */}
              {isMe && (
                <div className={styles.myTranslateWrap}>
                  <button
                    onClick={() => handleTranslateToggle(i, msg.content)}
                    className={styles.translateButton}
                  >
                    {isTranslated[i] ? "Original" : "Translate"}
                  </button>
                </div>
              )}

              {/* 💬 말풍선 */}
              <span
                className={`${styles.messageContent} ${
                  isMe ? styles.myMessage : styles.otherMessage
                }`}
              >
                <span
                  onClick={() => onReply(msg)}
                  dangerouslySetInnerHTML={{
                    __html: highlightTags(
                      isTranslated[i] && translated[i]
                        ? translated[i]
                        : msg.content
                    ),
                  }}
                />
                <span className={styles.timestamp}>{formattedTime}</span>
              </span>

              {/* ✅ 상대 메시지 → 버튼 아래쪽 오른쪽에 */}
              {!isMe && (
                <div className={styles.otherTranslateWrap}>
                  <button
                    onClick={() => handleTranslateToggle(i, msg.content)}
                    className={styles.translateButton}
                  >
                    {isTranslated[i] ? "Original" : "Translate"}
                  </button>
                </div>
              )}
            </div>
          </li>
        );
      })}
      <div ref={bottomRef} />
    </ul>
  );
}

