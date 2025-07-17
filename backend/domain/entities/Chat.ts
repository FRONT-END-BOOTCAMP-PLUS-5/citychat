export class Chat {
  constructor(
    public readonly id: number,
    public readonly chatRoomId: number,
    public readonly senderId: number,
    public readonly contentType: "text" | "image",
    public readonly content: string,
    public readonly sentAt: string,
    public readonly deletedFlag: boolean = false,
    public readonly parentChatId?: number,
    public readonly imageId?: number
  ) {}
}
