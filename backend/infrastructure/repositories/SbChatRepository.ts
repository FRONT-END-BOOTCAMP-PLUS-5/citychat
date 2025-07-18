import { SupabaseClient } from "@supabase/supabase-js";
import { ChatRepository } from "../../domain/repositories/ChatRepository";
import { Chat } from "../../domain/entities/Chat";
import { createClient } from "@/utils/supabase/server";

interface ChatTable {
  id: number;
  chat_room_id: number;
  user_id: number;
  content_type: "text" | "image";
  content: string;
  sent_at: string;
  deleted_flag: boolean;
  parent_chat_id?: number | null;
  image_id?: number | null;
}

export class SbChatRepository implements ChatRepository {

  constructor(private supabase: SupabaseClient) {}

  private mapToChat(chatTable: ChatTable): Chat {
    return new Chat(
      chatTable.id,
      chatTable.chat_room_id,
      chatTable.user_id,
      chatTable.content_type,
      chatTable.content,
      chatTable.sent_at,
      chatTable.deleted_flag,
      chatTable.parent_chat_id ?? undefined,
      chatTable.image_id ?? undefined,
    );
  }
  
  async getChatListByUserId(
    userId: number,
    offset: number = 0,
    limit: number = 10
  ): Promise<{ chats: Chat[]; total: number; hasMore: boolean; }> {

    try {
      // 전체 개수 조회
      const { count, error: countError } = await this.supabase
        .from("chats")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("deleted_flag", false);

      if (countError) throw new Error(countError.message);

      // 페이지네이션된 데이터 조회
      const { data, error } = await this.supabase
        .from("chats")
        .select("*")
        .eq("user_id", userId)
        .eq("deleted_flag", false)
        .order("sent_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw new Error(error.message);

      const chats: Chat[] = (data as ChatTable[])?.map((chatData) => this.mapToChat(chatData)) || [];

      const total = count ?? 0;
      const hasMore = offset + chats.length < total;

      return { chats, total, hasMore };
    } catch (error) {
      throw new Error(`Failed to get chat list : ${error instanceof Error ? error.message : "Unknown Error"}`);
    }
  }

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

