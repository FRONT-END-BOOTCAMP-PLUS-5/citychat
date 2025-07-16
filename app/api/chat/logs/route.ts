import { NextRequest, NextResponse } from "next/server";
import { SbChatLogRepository } from "@/backend/infrastructure/repositories/SbChatLogRepository";
import { GetRecentChatsUseCase } from "@/backend/application/chats/usecases/GetRecentChatUseCase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");
  const days = searchParams.get("days");

  if (!roomId || !days) {
    return NextResponse.json(
      { error: "roomId and days are required" },
      { status: 400 }
    );
  }

  const chatRoomId = parseInt(roomId, 10);
  const dayCount = parseInt(days, 10);

  if (isNaN(chatRoomId) || isNaN(dayCount)) {
    return NextResponse.json(
      { error: "roomId and days must be numbers" },
      { status: 400 }
    );
  }

  const useCase = new GetRecentChatsUseCase(new SbChatLogRepository());

  try {
    const messages = await useCase.execute({ chatRoomId, days: dayCount });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("❌ Error in /api/chats/logs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
