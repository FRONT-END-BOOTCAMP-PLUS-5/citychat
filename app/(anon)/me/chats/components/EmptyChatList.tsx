import { MessageSquare } from "lucide-react";
import styles from "./empty-chat-list.module.css";

const {
  ["empty-container"]: emptyContainer,
} = styles;

export default function EmptyChatList() {
  return (
    <div className={emptyContainer}>
      <MessageSquare size={50} />
      <h3>No chats</h3>
      <p>지역 채팅방에 참여해 대화를 시작해보세요</p>
      {/* <p>Start a conversation to see your chats here</p> */}
    </div>
  );
}
