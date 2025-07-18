import { ChatRepository } from "@/backend/domain/repositories/ChatRepository";
import { TagRepository } from "@/backend/domain/repositories/TagRepository";
import { SearchByChatRequestDto } from "../dtos/SearchByChatRequestDto";
import { Chat } from "@/backend/domain/entities/Chat";

export class SearchByChatUseCase {
  constructor(
    private readonly chatRepo: ChatRepository,
    private readonly tagRepo: TagRepository
  ) {}

  async execute({ chat, chatRoomId }: SearchByChatRequestDto): Promise<Chat[]> {
    const trimmed = chat.trim();

    // 태그 검색 (#태그)
    if (trimmed.startsWith("#") && trimmed.length > 1) {
      const tag = trimmed.slice(1); // # 제거
      return await this.tagRepo.searchByTagName(tag, chatRoomId);
    }

    // 키워드 검색 (일반 텍스트)
    return await this.chatRepo.searchByContent(trimmed, chatRoomId);
  }
}

