import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const roomId = Number(searchParams.get("roomId"));

  if (!roomId) {
    return NextResponse.json({ error: "roomId is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("chat_rooms")
    .select("chat_room_name, current_join_num")
    .eq("id", roomId)
    .single();

  if (error || !data) {
    console.error("❌ Supabase Error:", error);
    return NextResponse.json(
      { error: "채팅방을 찾을 수 없습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    chatRoomName: data.chat_room_name,
    currentJoinNum: data.current_join_num,
  });
}

