"use client";

import { ChatReplyProps } from "../types";
import { X } from "lucide-react";
import styles from "./ChatReply.module.css";

export function ChatReply({ msg, onCancel }: ChatReplyProps) {
  if (!msg.content || msg.content.length === 0) {
    return null;
  }

  return (
    <div className={styles.replyBox}>
      <div className={styles.replyTo}>
        <div className={styles.sender}>{msg.senderNickname}</div>
        <div className={styles.content}>{msg.content}</div>
      </div>
      <button onClick={onCancel} className={styles.button}>
        <X size={19} color="#3366cc" />
      </button>
    </div>
  );
}

