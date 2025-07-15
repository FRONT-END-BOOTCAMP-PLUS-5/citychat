import { NextRequest, NextResponse } from "next/server";
import { SbChatRepository } from "@/backend/infrastructure/repositories/SbChatRepository";
import { SbTagRepository } from "@/backend/infrastructure/repositories/SbTagRepository";
import { SearchByChatUseCase } from "@/backend/application/search-keyword/chats/usecases/SearchByChatUseCase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");
  const roomId = searchParams.get("roomId");

  if (!keyword || !roomId) {
    return NextResponse.json(
      { error: "keyword and roomId are required" },
      { status: 400 }
    );
  }

  const useCase = new SearchByChatUseCase(
    new SbChatRepository(),
    new SbTagRepository()
  );

  try {
    const chatRoomId = parseInt(roomId, 10);
    const result = await useCase.execute({ chat: keyword, chatRoomId });
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error in /api/chats/search:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

