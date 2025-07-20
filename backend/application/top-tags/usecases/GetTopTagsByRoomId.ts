import { TopTagRepository } from "@/backend/domain/repositories/TopTagRepository";
import { TopTagResponseDTO } from "../dtos/TopTagResponseDTO";

export class GetTopTagsByRoomId {
  constructor(private tagRepo: TopTagRepository) {}

  async execute(roomId: number): Promise<TopTagResponseDTO[]> {
    const tagStrings = await this.tagRepo.getTopTagsByRoomId(roomId);

    return tagStrings.map((tag) => ({
      tag,
    }));
  }
}

