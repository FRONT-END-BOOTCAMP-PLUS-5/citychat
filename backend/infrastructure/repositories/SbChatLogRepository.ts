import { createClient } from "@/utils/supabase/server";
import { ChatLogRepository } from "@/backend/domain/repositories/ChatLogRepository";
import { Chat } from "@/backend/domain/entities/Chat";

interface ChatRow {
  id: number;
  content: string;
  content_type: string;
  chat_room_id: number;
  user_id: number;
  sent_at: string;
  parent_chat_id?: number | null;
  image_id?: number | null;
  deleted_flag: boolean;
};

export class SbChatLogRepository implements ChatLogRepository {
  async getRecentMessages(chatRoomId: number, days: number): Promise<Chat[]> {
    const supabase = createClient();

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await (await supabase)
      .from("chats")
      .select("*")
      .eq("chat_room_id", chatRoomId)
      .eq("deleted_flag", false)
      .gte("sent_at", since)
      .order("sent_at", { ascending: true });

    if (error) {
      console.error("❌ getRecentMessages error:", error);
      return [];
    }

    return this.mapRowsToMessages(data); 
  }

  private mapRowsToMessages(rows: ChatRow[]): Chat[] {
    return rows.map((row) => ({
      id: row.id,
      content: row.content,
      contentType: row.content_type === "text" ? "text" : "image",
      chatRoomId: row.chat_room_id,
      userId: row.user_id,
      sentAt: row.sent_at,
      parentChatId: row.parent_chat_id ?? undefined,
      imageId: row.image_id ?? undefined,
      deletedFlag: row.deleted_flag,
    }));
  }
}
