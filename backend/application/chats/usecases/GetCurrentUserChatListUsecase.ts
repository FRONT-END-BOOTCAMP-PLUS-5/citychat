import { ApiResponse } from "@/app/types/ApiResponse";
import { ChatRepository } from "@/backend/domain/repositories/ChatRepository";
import { GetChatListRequestDto } from "../dtos/GetChatListRequestDto";
import { GetChatListResponseDto } from "../dtos/GetChatListResponseDto";

export class GetCurrentUserChatListUsecase {
  constructor(private chatRepository: ChatRepository) { }

  async execute(userId: number, request: GetChatListRequestDto): Promise<ApiResponse<GetChatListResponseDto>> {
    if (userId <= 0) {
      throw new Error("Invalid user ID");
    }

    const result = await this.chatRepository.getChatListByUserId(userId, request.offset, request.limit, request.chatRoomId);

    // Chat 엔티티를 ResponseDto로 변환
    const responseData: ApiResponse<GetChatListResponseDto> = {
      total: result.total,
      hasMore: result.hasMore,
      items: result.items.map(chat => GetChatListResponseDto.fromEntity(chat))
    };

    return responseData;
  }
}
