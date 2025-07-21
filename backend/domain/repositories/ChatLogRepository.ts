import { Chat } from "../entities/Chat";

export interface ChatLogRepository {
  getRecentMessages(chatRoomId: number, days: number): Promise<Chat[]>;
}
