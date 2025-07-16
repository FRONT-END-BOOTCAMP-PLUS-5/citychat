import { createClient } from "@/utils/supabase/server";
import { ChatLogRepository } from "@/backend/domain/repositories/ChatLogRepository";
import { Chat } from "@/backend/domain/entities/Chat";

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
} 