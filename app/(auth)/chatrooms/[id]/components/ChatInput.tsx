"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { parseTags } from "./ParseTags";
import { ChatReply } from "./ChatReply";
import { ChatInputProps } from "../types";

export default function ChatInput({
  onSend,
  replyTo,
  onCancelReply,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false); // 한글 입력 상태
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const tags = parseTags(input);
    onSend(input, tags, replyTo);
    setInput("");
    console.log("input", input);
    console.log("tags", tags);
    console.log("replyTo", replyTo);
    setTimeout(() => {
      textareaRef.current?.scrollIntoView({ behavior: "smooth" }); // 최근 채팅으로 스크롤 이동
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", marginTop: "1rem" }}
    >
      {replyTo && <ChatReply msg={replyTo} onCancel={onCancelReply} />}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)} // 한글 입력 시작
        onCompositionEnd={() => setIsComposing(false)} //한글 입력 종료
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
