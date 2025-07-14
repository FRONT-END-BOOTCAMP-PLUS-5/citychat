import { MessageRepository } from "@/backend/domain/repositories/MessageRepository";
import { Message } from "@/backend/domain/entities/Message";
import { createClient } from "@/lib/supabase";

export class SbMessageRepository implements MessageRepository {
  async searchByText(text: string, chatRoomId: number): Promise<Message[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .ilike("content", `%${text}%`)
      .eq("chat_room_id", chatRoomId)
      .eq("deleted_flag", false);

    if (error) {
      console.error("❌ searchByText 오류:", error);
      return [];
    }

    return this.mapRowsToMessages(data);
  }

  async searchByTag(tag: string, chatRoomId: number): Promise<Message[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tags")
      .select("message_id, chats(*)") // chats와 조인
      .eq("tag", tag)
      .eq("chats.chat_room_id", chatRoomId)
      .eq("chats.deleted_flag", false);

    if (error) {
      console.error("❌ searchByTag 오류:", error);
      return [];
    }

    const rows = (data ?? []).map((row) => row.chats).filter(Boolean);
    return this.mapRowsToMessages(rows);
  }

  private mapRowsToMessages(rows: any[]): Message[] {
    return rows.map(
      (row) =>
        new Message(
          row.id,
          row.chat_room_id,
          row.user_id,
          row.content_type,
          row.content,
          new Date(row.sent_at),
          row.parent_chat_id ?? undefined,
          row.image_id ?? undefined,
          row.deleted_flag
        )
    );
  }
}
