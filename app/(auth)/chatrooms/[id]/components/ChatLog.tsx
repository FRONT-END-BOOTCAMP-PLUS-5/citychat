"use client";

import { use, useEffect, useRef, useState } from "react";
import { ChatReply } from "./ChatReply";

interface Message {
  content: string;
  tags?: string[];
  sender: string;
}

interface ChatLogProps {
  messages: Message[];
  onReply: (msg: Message) => void;
}
export default function ChatLog({ messages, onReply }: ChatLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ul
      style={{ minHeight: 200, maxHeight: 300, overflowY: "auto", padding: 0 }}
    >
      {messages.map((msg, i) => (
        <li key={i} style={{ marginBottom: "8px", listStyle: "none" }}>
          <span
            style={{
              fontWeight: "light",
            }}
          >
            {msg.sender}
          </span>

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
        </li>
      ))}
      <div ref={bottomRef} />
    </ul>
  );
}
