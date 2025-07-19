"use client";

import { ChatReplyProps } from "../types";
import styles from "./ChatReply.module.css";
import { X, CornerDownRight } from "lucide-react";

export function ChatReply({ msg, onCancel }: ChatReplyProps) {
  if (!msg.content || msg.content.length === 0) {
    return null;
  }

  return (
    <div className={styles.replyBox}>
      <div className={styles.replyTo}>
        <span>
          <CornerDownRight size={15} color="#669cf4ff" />
          <span className={styles.sender}>{msg.senderNickname}</span>
        </span>
        <div className={styles.content}>{msg.content}</div>
      </div>
      <button onClick={onCancel} className={styles.button}>
        <X size={15} color="#3366cc" />
      </button>
    </div>
  );
}

