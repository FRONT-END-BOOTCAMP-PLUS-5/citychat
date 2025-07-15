import { Chat } from "../entities/Chat";

export interface ChatRepository {
  searchByKeyword(keyword: string, chatRoomId: number): Promise<Chat[]>;
}
