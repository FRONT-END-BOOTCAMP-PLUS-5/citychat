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
  searchResultIds = [],
  currentIndex = 0,
  onNavigateSearchResult,
}: ChatLogProps & {
  searchResultIds?: number[];
  currentIndex?: number;
  onNavigateSearchResult?: (direction: "prev" | "next") => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<number, HTMLLIElement | null>>(new Map());
  const highlightSet = new Set(searchResultIds);
  const [renderedMessages, setRenderedMessages] = useState(incomingMessages);
  const [translated, setTranslated] = useState<Record<number, string>>({});
  const [isTranslated, setIsTranslated] = useState<Record<number, boolean>>({});

  // ✅ 새로운 메시지 감지하여 추가
  useEffect(() => {
    if (incomingMessages.length > renderedMessages.length) {
      const newMessages = incomingMessages.slice(renderedMessages.length);
      setRenderedMessages((prev) => [...prev, ...newMessages]);
    }
  }, [incomingMessages]);

  useEffect(() => {
    setRenderedMessages(incomingMessages);
  }, [searchResultIds, incomingMessages]);

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
  // ✅ 검색 결과로 스크롤 이동
  useEffect(() => {
    const targetId = Number(searchResultIds[currentIndex]);
    console.log("search결과", searchResultIds);
    console.log("✅ currentIndex:", currentIndex);
    console.log("✅ targetId to scroll:", targetId);
    console.log("✅ all ref keys:", Array.from(messageRefs.current.keys()));
    setTimeout(() => {
      const targetElement = messageRefs.current.get(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        console.warn("❌ ref 없음:", targetId);
      }
    }, 0); // 0ms 딜레이로 다음 이벤트 루프에서 실행
  }, [currentIndex, searchResultIds]);

  return (
    <>
      <ul className={styles.chatContainer}>
        {renderedMessages.map((msg, i) => {
          const isMe = msg.senderId === currentUserId;
          const isHighlighted = highlightSet.has(msg.id!);
          const formattedTime = msg.sentAt
            ? format(new Date(msg.sentAt), "a h:mm", { locale: ko })
            : "";
          const repliedTo = msg.replyToId
            ? renderedMessages.find((m) => m.id === msg.replyToId)
            : null;

          return (
            <li
              key={msg.id}
              ref={(el) => {
                if (msg.id != null && el) {
                  const numericId = Number(msg.id);
                  console.log("✅ ref 등록됨:", numericId);
                  messageRefs.current.set(numericId, el);
                }
              }}
              className={`${styles.messageItem} ${
                isHighlighted ? styles.highlighted : ""
              }`}
            >
              <span className={styles.sender}>
                {isMe ? "" : msg.senderNickname}
              </span>

              {repliedTo && (
                <div className={styles.replyBox}>
                  <div>↪ {repliedTo.senderNickname}</div>
                  <div>{repliedTo.content}</div>
                </div>
              )}

              <div
                className={`${styles.messageWrapper} ${
                  isMe ? styles.myWrapper : styles.otherWrapper
                }`}
              >
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
                  <span
                    className={`${
                      isMe ? styles.mytimestamp : styles.othertimestamp
                    }`}
                  >
                    {formattedTime}
                  </span>
                </span>
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

      {searchResultIds.length > 0 && (
        <div className={styles.searchNav}>
          <button onClick={() => onNavigateSearchResult?.("prev")}>◀</button>
          <span>
            {currentIndex + 1} / {searchResultIds.length}
          </span>
          <button onClick={() => onNavigateSearchResult?.("next")}>▶</button>
        </div>
      )}
    </>
  );
}

