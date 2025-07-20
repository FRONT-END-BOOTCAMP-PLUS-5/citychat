"use client";

import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import styles from "./empty-chat-list.module.css";

const { ["empty-container"]: emptyContainer, ["menu-item"]: menuItem } = styles;

interface EmptyChatListProps {
  id: string;
}

export default function EmptyChatList({ id }: EmptyChatListProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/chatrooms/${id}`);
  };

  return (
    <div className={emptyContainer}>
      <MessageSquare size={50} />
      <h3>No chats</h3>
      <p>지역 채팅방에 참여해 대화를 시작해보세요</p>
      <p className={menuItem} onClick={handleClick}>
        Start Chat
      </p>
    </div>
  );
}

