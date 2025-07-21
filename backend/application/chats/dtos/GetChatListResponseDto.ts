import { Chat } from "@/backend/domain/entities/Chat";

export interface GetChatListResponseDto {
  id: number;
  chatRoomId: number;
  senderId: number;
  contentType: "text" | "image";
  content: string;
  sentAt: string;
  deletedFlag: boolean;
  parentChatId?: number;
  imageId?: number;
}

export const GetChatListResponseDto = {
  fromEntity: (chat: Chat): GetChatListResponseDto => ({
    id: chat.id,
    chatRoomId: chat.chatRoomId,
    senderId: chat.senderId,
    contentType: chat.contentType,
    content: chat.content,
    sentAt: chat.sentAt,
    deletedFlag: chat.deletedFlag,
    parentChatId: chat.parentChatId,
    imageId: chat.imageId
  })
};
