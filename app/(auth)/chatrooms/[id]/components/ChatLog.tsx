"use client";

import { useEffect, useRef } from "react";
import { ChatLogProps } from "../types";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function ChatLog({ messages, onReply }: ChatLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("ChatLog messages:", messages);
  }, [messages]);

  return (
    <ul
      style={{ minHeight: 200, maxHeight: 300, overflowY: "auto", padding: 0 }}
    >
      {messages.map((msg, i) => {
        const formattedTime = msg.sent_at
          ? format(new Date(msg.sent_at), "a h:mm", { locale: ko })
          : "";

        return (
          <li key={i} style={{ marginBottom: "8px", listStyle: "none" }}>
            <span style={{ fontWeight: "light" }}>{msg.sender}</span>

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
            >
              {msg.content}
            </span>

            <span
              style={{ marginLeft: "8px", fontSize: "12px", color: "#888" }}
            >
              {formattedTime}
            </span>
          </li>
        );
      })}
      <div ref={bottomRef} />
    </ul>
  );
}
