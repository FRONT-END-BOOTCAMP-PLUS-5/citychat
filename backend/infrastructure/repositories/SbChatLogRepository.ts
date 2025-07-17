import { SupabaseClient } from "@supabase/supabase-js";
import { ChatLogRepository } from "@/backend/domain/repositories/ChatLogRepository";
import { Chat } from "@/backend/domain/entities/Chat";

interface ChatRow {
  id: number;
  content: string;
  content_type: "text" | "image";
  chat_room_id: number;
  user_id: number;
  sent_at: string;
  parent_chat_id?: number | null;
  image_id?: number | null;
  deleted_flag: boolean;
  users?:{ nickname : string };
}

export class SbChatLogRepository implements ChatLogRepository {
  constructor(private supabase: SupabaseClient) {}

  async getRecentMessages(chatRoomId: number, days: number): Promise<Chat[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await this.supabase
      .from("chats")
      .select(`
        id,
        content,
        content_type,
        chat_room_id,
        user_id,
        sent_at,
        parent_chat_id,
        image_id,
        deleted_flag,
        users(
          nickname
        )
      `)
      .eq("chat_room_id", chatRoomId)
      .eq("deleted_flag", false)
      .gte("sent_at", since)
      .order("sent_at", { ascending: true });
    
    if (error || !data) {
      console.error("❌ Supabase error in getRecentMessages:", error?.message);
      return [];
    }

    return this.mapRowsToMessages(data as unknown as ChatRow[]);
  }

  private mapRowsToMessages(rows: ChatRow[]): Chat[] {
    return rows.map((row) => ({
      id: row.id,
      content: row.content,
      contentType: row.content_type,
      chatRoomId: row.chat_room_id,
      senderId: row.user_id,
      senderNickname: row.users?.nickname ?? "Unknown",
      sentAt: row.sent_at,
      parentChatId: row.parent_chat_id ?? undefined,
      imageId: row.image_id ?? undefined,
      deletedFlag: row.deleted_flag,
    }));
  }
}
