"use client";

import { useEffect, useRef, useState } from "react";
import { ChatLogProps } from "../types";
import { highlightTags } from "./ParseTags";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function ChatLog({ messages, onReply }: ChatLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [translated, setTranslated] = useState<Record<number, string>>({});
  const [isTranslated, setIsTranslated] = useState<Record<number, boolean>>({});

  //Google Translate API 연결 함수
  const handleTranslateToggle = async (index: number, content: string) => {
    if (isTranslated[index]) {
      // 🔙 번역 닫기 (원문 보기)
      setIsTranslated((prev) => ({ ...prev, [index]: false }));
    } else {
      // 🔁 번역 요청 + 표시
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
  }, [messages]);

  return (
    <ul
      style={{ minHeight: 200, maxHeight: 300, overflowY: "auto", padding: 0 }}
    >
      {messages.map((msg, i) => {
        const formattedTime = msg.sent_at
          ? format(new Date(msg.sent_at), "a h:mm", { locale: ko })
          : "";

        const repliedTo = msg.replyToId
          ? messages.find((m) => m.id === msg.replyToId)
          : null;

        return (
          <li key={i} style={{ marginBottom: "8px", listStyle: "none" }}>
            <span style={{ fontWeight: "light" }}>{msg.sender}</span>
            {repliedTo && (
              <div
                style={{
                  marginBottom: "4px",
                  padding: "4px 8px",
                  backgroundColor: "#e0e0e0",
                  borderLeft: "4px solid #999",
                  fontSize: "0.85rem",
                  color: "#333",
                }}
              >
                <div> ↪{repliedTo.sender}</div>
                <div>{repliedTo.content}</div>
              </div>
            )}
            <span
              style={{
                margin: "2%",
                padding: "2%",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                height: "fit-content",
                display: "inline-block",
              }}
              onClick={() => onReply(msg)}
              dangerouslySetInnerHTML={{
                __html: highlightTags(
                  isTranslated[i] && translated[i] ? translated[i] : msg.content
                ),
              }}
            />

            <span
              style={{ marginLeft: "8px", fontSize: "12px", color: "#888" }}
            >
              {formattedTime}
            </span>

            <button
              onClick={() => handleTranslateToggle(i, msg.content)}
              style={{
                fontSize: "0.8rem",
                marginTop: "4px",
                color: "#8ECAE6",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
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
