import { Chat } from "../entities/Chat";

export interface ChatRepository {
  searchByContent(keyword: string, chatRoomId: number): Promise<Chat[]>;
}
