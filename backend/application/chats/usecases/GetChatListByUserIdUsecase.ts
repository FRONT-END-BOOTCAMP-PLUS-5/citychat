import { Chat } from "@/backend/domain/entities/Chat";
import { ChatRepository } from "@/backend/domain/repositories/ChatRepository";

export class GetChatListByUserIdUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(userId: number, offset: number = 0, limit: number = 10): Promise<{
    chats: Chat[],
    total: number,
    hasMore: boolean
  }> {
    if (userId <= 0) {
      throw new Error("Invalid user ID");
    }

    if (offset < 0 || limit <= 0 || limit > 100) {
      throw new Error("Invalid pagination parameters");
    }

    return await this.chatRepository.getChatListByUserId(userId, offset, limit);
  }
}
