export class Message {
  constructor(
    public readonly id: number,
    public readonly chatRoomId: number,
    public readonly userId: number,
    public readonly contentType: string,
    public readonly content: string | null,
    public readonly sentAt: Date,
    public readonly parentChatId?: number,
    public readonly imageId?: number,
    public readonly deletedFlag: boolean = false
  ) {}

  isDeleted(): boolean {
    return this.deletedFlag;
  }

  isReply(): boolean {
    return !!this.parentChatId;
  }

  isImage(): boolean {
    return this.contentType === "image";
  }

  isText(): boolean {
    return this.contentType === "text";
  }
}
