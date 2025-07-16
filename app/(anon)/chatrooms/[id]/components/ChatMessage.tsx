// components/ChatMessage.tsx

import React from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { highlightTags } from "./ParseTags";
import styles from "./ChatLog.module.css";
import { Message } from "../types";

interface Props {
  msg: Message;
  index: number;
  currentUserId: number | null;
  onReply: (msg: Message) => void;
  repliedTo?: Message | null;
  translated?: string;
  isTranslated?: boolean;
  onTranslateToggle: (index: number, content: string) => void;
}

function ChatMessage({
  msg,
  index,
  currentUserId,
  onReply,
  repliedTo,
  translated,
  isTranslated,
  onTranslateToggle,
}: Props) {
  const isMe = msg.senderId === currentUserId;
  const formattedTime = msg.sent_at
    ? format(new Date(msg.sent_at), "a h:mm", { locale: ko })
    : "";

  return (
    <li className={styles.messageItem}>
      <span className={styles.sender}>{isMe ? "나" : msg.sender}</span>

      {repliedTo && (
        <div className={styles.replyBox}>
          <div>↪ {repliedTo.sender}</div>
          <div>{repliedTo.content}</div>
        </div>
      )}

      <span
        className={`${styles.messageContent} ${
          isMe ? styles.myMessage : styles.otherMessage
        }`}
        onClick={() => onReply(msg)}
        dangerouslySetInnerHTML={{
          __html: highlightTags(
            isTranslated && translated ? translated : msg.content
          ),
        }}
      />

      <span className={styles.timestamp}>{formattedTime}</span>

      <button
        onClick={() => onTranslateToggle(index, msg.content)}
        className={styles.translateButton}
      >
        {isTranslated ? "Original" : "Translate"}
      </button>
    </li>
  );
}

export default React.memo(ChatMessage);
