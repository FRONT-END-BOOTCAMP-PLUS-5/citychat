import { ApiResponse } from "@/app/types/ApiResponse";
import { Chat } from "../entities/Chat";

export interface ChatRepository {
  searchByContent(keyword: string, chatRoomId: number): Promise<Chat[]>;
  getChatListByUserId(userId: number, offset?: number, limit?: number, chatRoomId?: number): Promise<ApiResponse<Chat>>;
}
