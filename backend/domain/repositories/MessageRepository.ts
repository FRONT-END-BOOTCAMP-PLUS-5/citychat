import { Message } from "../entities/Message";

export interface MessageRepository {
  searchByTag(tag: string, chatRoomId: number): Promise<Message[]>;
  searchByText(text: string, chatRoomId: number): Promise<Message[]>;
}
