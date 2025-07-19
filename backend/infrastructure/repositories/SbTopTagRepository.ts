import { createClient } from "@/utils/supabase/server";
import { TopTagRepository } from "@/backend/domain/repositories/TopTagRepository";

type RawTagRow = { tag: string };

export class SbTopTagRepository implements TopTagRepository {
  async getTopTagsByRoomId(roomId: number): Promise<string[]> {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("get_top_tags_by_room", {
      room_id: roomId,
    });

    // 타입 단언 추가
    const tagData = data as RawTagRow[];

    if (error || !tagData) {
      console.error("❌ Supabase RPC 오류:", error?.message);
      return [];
    }

    return tagData.map((item) => item.tag);
  }
}

