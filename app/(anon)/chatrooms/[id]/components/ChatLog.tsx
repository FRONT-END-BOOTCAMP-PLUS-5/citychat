"use client";

import { useEffect, useRef, useState } from "react";
import { ChatLogProps, Message } from "../types";
import { highlightTags } from "./ParseTags";
import styles from "./ChatLog.module.css";
import {
  CircleChevronLeft,
  CircleChevronRight,
  CornerDownRight,
} from "lucide-react";

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
  const [scrollByReply, setScrollByReply] = useState(false);

  // 페이지 렌더링 시 채팅방 맨 아래로 강제 스크롤, 애니메이션 없이
  useEffect(() => {
    if (searchResultIds.length === 0 && renderedMessages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [renderedMessages]);

  // 새로운 메시지 감지하여 추가
  useEffect(() => {
    if (incomingMessages.length > renderedMessages.length) {
      const newMessages = incomingMessages.slice(renderedMessages.length);
      console.log(newMessages);
      setRenderedMessages((prev) => [...prev, ...newMessages]);
    }
  }, [incomingMessages]);

  useEffect(() => {
    setRenderedMessages(incomingMessages);
  }, [searchResultIds, incomingMessages]);

  // 검색 결과 초기화 시 최신 채팅으로 복구
  useEffect(() => {
    if (searchResultIds.length === 0) {
      setRenderedMessages(incomingMessages);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [searchResultIds, incomingMessages]);

  // 새 메시지 추가 시 맨 아래로 스크롤
  useEffect(() => {
    if (scrollByReply) {
      setScrollByReply(false);
      return;
    }
    if (searchResultIds.length > 0) {
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [renderedMessages]);

  //번역과 원본 토글 기능
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

  // 검색 결과로 스크롤 이동
  useEffect(() => {
    const reversed = [...searchResultIds].reverse();
    const targetId = Number(reversed[currentIndex]);
    setTimeout(() => {
      const targetElement = messageRefs.current.get(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        // console.warn("❌ ref 없음:", targetId);
      }
    }, 1000);
  }, [currentIndex, searchResultIds]);

  // 줄바꿈을 줄바꿈 태그로 바꾸기
  function formatMultilineContent(content: string) {
    const html = content.replace(/\n/g, "<br />");
    return highlightTags(html);
  }

  // 답장 시 해당 메세지로 스크롤 이동
  const handleReplyWithScroll = (msg: Message) => {
    const element = messageRefs.current.get(msg.id!);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setScrollByReply(true);
    }
    onReply(msg); // 기존 reply 콜백 실행
  };

  return (
    <>
      <ul className={styles.chatContainer}>
        {renderedMessages.map((msg, i) => {
          const isMe = msg.senderId === currentUserId;
          const isHighlighted = highlightSet.has(msg.id!);
          const formattedTime = msg.sentAt
            ? new Date(msg.sentAt).toLocaleTimeString("ko-KR", {
                timeZone: "Asia/Seoul",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })
            : "";
          return (
            <li
              key={msg.id}
              ref={(el) => {
                if (msg.id != null && el) {
                  const numericId = Number(msg.id);
                  messageRefs.current.set(numericId, el);
                }
              }}
              className={`${styles.messageItem}`}
            >
              <span className={styles.sender}>
                {isMe ? "" : msg.senderNickname}
              </span>
              {msg.parentChatId != null &&
                (() => {
                  const repliedToMsg =
                    renderedMessages.find((m) => m.id === msg.parentChatId) ??
                    incomingMessages.find((m) => m.id === msg.parentChatId);

                  console.log("📌 현재 msg.id:", msg.id);
                  console.log("📌 msg.parentChatId:", msg.parentChatId);
                  console.log(
                    "📌 renderedMessages:",
                    renderedMessages.map((m) => m.id)
                  );
                  console.log(
                    "📌 incomingMessages:",
                    incomingMessages.map((m) => m.id)
                  );

                  if (!repliedToMsg) {
                    return null;
                  }
                  return (
                    <div
                      className={`${styles.replyBox} ${
                        isMe ? styles.replyRight : styles.replyLeft
                      }`}
                    >
                      <div className={styles.replyContent}>
                        <CornerDownRight
                          size={10}
                          color="#669cf4ff"
                          className={styles.replyArrow}
                        />
                        <div className={styles.reply}>
                          <div className={styles.replyTo}>
                            {repliedToMsg.senderNickname}
                          </div>
                          <div>{repliedToMsg.content}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

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
                  } ${isHighlighted ? styles.highlighted : ""}`}
                >
                  <span
                    onClick={() => handleReplyWithScroll(msg)}
                    dangerouslySetInnerHTML={{
                      __html: formatMultilineContent(
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
          <button
            className={styles.button}
            onClick={() => onNavigateSearchResult?.("prev")}
          >
            {" "}
            <CircleChevronLeft size={19} color="#669cf4ff" />
          </button>
          <span>
            {currentIndex + 1} / {searchResultIds.length}
          </span>
          <button
            className={styles.button}
            onClick={() => onNavigateSearchResult?.("next")}
          >
            <CircleChevronRight size={19} color="#669cf4ff" />
          </button>
        </div>
      )}
    </>
  );
}

