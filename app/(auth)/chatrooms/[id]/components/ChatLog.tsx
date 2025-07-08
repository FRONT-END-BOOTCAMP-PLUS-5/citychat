"use client";

import { useEffect, useRef } from "react";

interface Message {
  content: string;
  sender: string;
}

interface ChatLogProps {
  messages: Message[];
}

export default function ChatLog({ messages }: ChatLogProps) {
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
          <strong>{msg.sender}:</strong> {msg.content}
        </li>
      ))}
      <div ref={bottomRef} />
    </ul>
  );
}
