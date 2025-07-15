import { MessageRepository } from "@/domain/repositories/MessageRepository";
import { SearchByTagRequestDto } from "../dtos/SearchByTagRequestDto";

export class SearchByTagUseCase {
  constructor(private readonly messageRepo: MessageRepository) {}

  async execute({ tag, chatRoomId }: SearchByTagRequestDto) {
    return this.messageRepo.searchByTag(tag, chatRoomId);
  }
}
