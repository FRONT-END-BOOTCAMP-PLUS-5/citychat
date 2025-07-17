import { TagRepository } from "@/backend/domain/repositories/TagRepository";
import { Chat } from "@/backend/domain/entities/Chat";
import { createClient } from "@/utils/supabase/server";


type SupabaseTagRow = {
  id: number;
  tag_name: string;
  chat_tags: {
    chats: {
      id: number;
      chat_room_id: number;
      user_id: number;
      content_type: "text" | "image";
      content: string;
      sent_at: string;
      deleted_flag: boolean;
      parent_chat_id?: number;
      image_id?: number;
    };
  }[];
};

export class SbTagRepository implements TagRepository {
  async searchByTagName(tagName: string, chatRoomId: number): Promise<Chat[]> {
    const supabase = createClient();

    const { data, error } = await (await supabase)
      .from("tags")
      .select(`
        id,
        tag_name,
        chat_tags (
          chats (
            id,
            chat_room_id,
            user_id,
            content_type,
            content,
            sent_at,
            deleted_flag,
            parent_chat_id,
            image_id
          )
        )
      `)
      .eq("tag_name", tagName)
      .returns<SupabaseTagRow[]>(); // ✅ 타입 지정 완료

    if (error) {
      console.error("❌ Supabase error in searchByTagName:", error);
      return [];
    }

    const chats: Chat[] = [];

    data?.forEach((tagRow) => {
      tagRow.chat_tags?.forEach((chatTag) => {
        const chat = chatTag.chats;

        if (chat.chat_room_id === chatRoomId && chat.deleted_flag === false) {
          chats.push(
            new Chat(
              chat.id,
              chat.chat_room_id,
              chat.user_id,
              chat.content_type,
              chat.content,
              chat.sent_at,
              chat.deleted_flag,
              chat.parent_chat_id,
              chat.image_id
            )
          );
        }
      });
    });

    return chats;
  }
}
