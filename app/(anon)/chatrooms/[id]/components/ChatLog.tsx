"use client";

import { AdaptChatFromSupabase } from "./AdaptChatFromSupabase";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useEffect, useRef, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
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
  const adaptedMessages = useMemo(
    () => incomingMessages.map(AdaptChatFromSupabase),
    [incomingMessages]
  );
  useEffect(() => {
    setLoading(false);
    const adapted = incomingMessages.map(AdaptChatFromSupabase);
    setRenderedMessages(adapted);
    setLoading(true);
  }, [incomingMessages]);
  const [loading, setLoading] = useState(true);
  const highlightSet = new Set(searchResultIds);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<number, HTMLLIElement | null>>(new Map());
  const [renderedMessages, setRenderedMessages] = useState(adaptedMessages);
  const [translated, setTranslated] = useState<Record<number, string>>({});
  const [isTranslated, setIsTranslated] = useState<Record<number, boolean>>({});
  const [scrollByReply, setScrollByReply] = useState(false);
  const searchParams = useSearchParams();
  const targetChatIdParam = searchParams.get("chatId");

  // 페이지 렌더링 시 채팅방 맨 아래로 강제 스크롤, 애니메이션 없이
  useEffect(() => {
    if (searchResultIds.length === 0 && renderedMessages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [renderedMessages]);

  // ✅ 처음 렌더링 시 adaptedMessages를 렌더링에 세팅
  useEffect(() => {
    // adaptedMessages가 새로 들어왔을 때만 렌더링
    if (incomingMessages.length > renderedMessages.length) {
      setLoading(false);
      const newMessages = incomingMessages.slice(renderedMessages.length);
      console.log("🔄 새 메시지 추가됨:", newMessages);
      const newAdaptedMessages = newMessages.map(AdaptChatFromSupabase);
      console.log("💡", newAdaptedMessages);
      setRenderedMessages((prev) => [...prev, ...newAdaptedMessages]);
    }
    setLoading(true);
  }, [incomingMessages]);

  // ✅ 검색 초기화 시도 adaptedMessages 사용
  useEffect(() => {
    if (searchResultIds.length === 0) {
      setRenderedMessages(adaptedMessages);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [searchResultIds, adaptedMessages]);

  // 검색 결과 초기화 시 최신 채팅으로 복구
  useEffect(() => {
    if (searchResultIds.length === 0) {
      setRenderedMessages(adaptedMessages);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [searchResultIds, adaptedMessages]);

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
    }, 500);
  }, [currentIndex, searchResultIds]);

  // 내가 작성한 메세지로 스크롤 이동
  useEffect(() => {
    if (!targetChatIdParam) return;
    const targetChatId = Number(targetChatIdParam);
    const targetElement = messageRefs.current.get(targetChatId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [renderedMessages, targetChatIdParam]);

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

  //
  return (
    <>
      {loading ? (
        <>
          <ul className={styles.chatContainer}>
            {renderedMessages.map((msg, i) => {
              console.log("페이지 렌더링");
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
                  {msg.replyToId != null &&
                    (() => {
                      const repliedToMsg = renderedMessages.find(
                        (m) => m.id === msg.replyToId
                      );
                      if (!repliedToMsg) return null;

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
      ) : (
        <LoadingSpinner size={10} /> // 또는 null을 주어 렌더 안되게 할 수도 있음
      )}
    </>
  );
}

