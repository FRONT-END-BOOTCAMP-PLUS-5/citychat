import { ChatLogRepository } from "@/backend/domain/repositories/ChatLogRepository";

interface Input {
  chatRoomId: number;
  days: number;
}

export class GetRecentChatsUseCase {
  constructor(private repository: ChatLogRepository) {}

  async execute(input: Input) {
    return this.repository.getRecentMessages(input.chatRoomId, input.days);
  }
}
