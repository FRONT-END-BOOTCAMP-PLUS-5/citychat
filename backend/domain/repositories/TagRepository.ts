import { Chat } from "../entities/Chat";

export interface TagRepository {
  searchByTagName(tagName: string, chatRoomId: number): Promise<Chat[]>;
}
