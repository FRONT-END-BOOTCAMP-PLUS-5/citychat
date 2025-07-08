"use client";

import { useState, useRef, KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (content: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");

    // 스크롤 맨 아래로
    setTimeout(() => {
      textareaRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", marginTop: "1rem" }}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요 (Enter: 전송, Shift+Enter: 줄바꿈)"
        style={{
          padding: "8px",
          resize: "none",
          height: "80px",
          fontSize: "1rem",
        }}
      />
      <button
        onClick={handleSend}
        style={{ marginTop: "8px", alignSelf: "flex-end" }}
      >
        전송
      </button>
    </div>
  );
}
