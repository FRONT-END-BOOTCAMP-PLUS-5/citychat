"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { parseTags } from "./ParseTags";
import { ChatReply } from "./ChatReply";
import { ChatInputProps } from "../types";
import { SendHorizontal } from "lucide-react";
import styles from "./ChatInput.module.css";

export default function ChatInput({
  onSend,
  replyTo,
  onCancelReply,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const tags = parseTags(input);
    onSend(input, tags, replyTo);
    setInput("");
    if (replyTo) onCancelReply();
    setTimeout(() => {
      textareaRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.inputWrapper}>
      {replyTo && <ChatReply msg={replyTo} onCancel={onCancelReply} />}
      <div className={styles.inputArea}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="메시지를 입력하세요"
          className={styles.textarea}
        />
        <button onClick={handleSend} className={styles.sendButton}>
          <SendHorizontal size={15} />
        </button>
      </div>
    </div>
  );
}

