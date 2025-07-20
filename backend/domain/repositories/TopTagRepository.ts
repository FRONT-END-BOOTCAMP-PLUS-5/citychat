export interface TopTagRepository {
  getTopTagsByRoomId(roomId: number): Promise<string[]>;
}

