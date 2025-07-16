"use client";

import styles from "./ChatLog.module.css";
import { Message } from "../types";
import { format } from "date-fns";

interface Props {
  msg: Message;
  currentUserId: number | null;
  onReply: (msg: Message) => void;
  translated?: string;
  onTranslate: () => void;
  isTranslated: boolean;
}

export default function ChatMessage({
  msg,
  currentUserId,
  onReply,
  translated,
  onTranslate,
  isTranslated,
}: Props) {
  const isMine = msg.senderId === currentUserId;
  const sentTime = msg.sent_at
    ? format(new Date(msg.sent_at), "HH:mm")
    : "";

  return (
    <div
      className={`${styles.messageWrapper} ${
        isMine ? styles.myMessage : ""
      }`}
      onClick={() => onReply(msg)}
    >
      <div className={styles.senderName}>{msg.sender}</div>
      <div className={`${styles.bubble} ${isMine ? styles.myBubble : ""}`}>
        {isTranslated ? translated : msg.content}
        <div className={styles.time}>{sentTime}</div>
      </div>
      <button className={styles.translateButton} onClick={onTranslate}>
        {isTranslated ? "원문 보기" : "번역"}
      </button>
    </div>
  );
}
