import { SearchQueryDto } from "../dtos/SearchQueryDto";
import { MessageRepository } from "@/backend/domain/repositories/MessageRepository";
import { Message } from "@/backend/domain/entities/Message";

export class SearchMessageUsecase {
  constructor(private readonly messageRepo: MessageRepository) {}

  async execute(dto: SearchQueryDto): Promise<Message[]> {
    const { query, chatRoomId } = dto;

    if (!query) {
      return [];
    }

    if (query.startsWith("#")) {
      const tag = query.slice(1);
      return this.messageRepo.searchByTag(tag, chatRoomId);
    }

    return this.messageRepo.searchByText(query, chatRoomId);
  }
}
