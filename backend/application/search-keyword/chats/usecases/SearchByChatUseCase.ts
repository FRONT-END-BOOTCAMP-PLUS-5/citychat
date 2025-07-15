import { MessageRepository } from "@/domain/repositories/MessageRepository";
import { SearchByChatRequestDto } from "../dtos/SearchByChatRequestDto";

export class SearchByChatUseCase {
  constructor(private readonly messageRepo: MessageRepository) {}

  async execute({ chat, chatRoomId }: SearchByChatRequestDto) {
    return this.messageRepo.searchByText(chat, chatRoomId);
  }
}
