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
