import { ChatRepository } from "../../domain/repositories/ChatRepository";
import { Chat } from "../../domain/entities/Chat";
import { createClient } from "@/utils/supabase/server";

export class SbChatRepository implements ChatRepository {
  async searchByContent(keyword: string, chatRoomId: number): Promise<Chat[]> {
    const supabase = createClient();

    const { data, error } = await (
      await supabase
    )
      .from("chats")
      .select(
        `
        id,
        chat_room_id,
        user_id,
        content_type,
        content,
        sent_at,
        deleted_flag,
        parent_chat_id,
        image_id
      `
      )
      .eq("chat_room_id", chatRoomId)
      .eq("deleted_flag", false)
      .ilike("content", `%${keyword}%`)
      .order("sent_at", { ascending: false });

    if (error) {
      console.error("❌ Supabase error in searchByContent:", error);
      return [];
    }

    const chats: Chat[] =
      data?.map((chat) => {
        return new Chat(
          chat.id,
          chat.chat_room_id,
          chat.user_id,
          chat.content_type,
          chat.content,
          chat.sent_at,
          chat.deleted_flag,
          chat.parent_chat_id,
          chat.image_id
        );
      }) || [];

    return chats;
  }
}

