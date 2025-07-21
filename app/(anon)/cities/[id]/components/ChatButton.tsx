"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./chatButton.module.css";

interface ChatButtonProps {
  cityId: string;
}

const ChatButton: React.FC<ChatButtonProps> = ({ cityId }) => {
  const router = useRouter();

  const handleClick = () => {
    if (cityId) {
      router.push(`/chatrooms/${cityId}`);
    }
  };

  return (
    <div className={styles.buttonWrap}>
      <button className={styles.chatButton} onClick={handleClick}>
        Start Chat
      </button>
    </div>
  );
};

export default ChatButton;

