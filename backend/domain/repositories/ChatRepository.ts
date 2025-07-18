import { Chat } from "../entities/Chat";

export interface ChatRepository {
  searchByContent(keyword: string, chatRoomId: number): Promise<Chat[]>;
  getChatListByUserId(userId: number, offset?: number, limit?: number): Promise<{chats: Chat[], total: number, hasMore: boolean}>;
}
