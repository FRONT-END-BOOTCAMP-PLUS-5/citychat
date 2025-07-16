import { ChatLogRepository } from "@/backend/domain/repositories/ChatLogRepository";
import { Chat } from "@/backend/domain/entities/Chat";

export class ChatService {
  constructor(private chatRepository: ChatLogRepository) {}

  async getRecentChatMessages(chatRoomId: number): Promise<Chat[]> {
    return this.chatRepository.getRecentMessages(chatRoomId, 10); //10일 이내의 채팅 기록만 가져오도록
  }
}
