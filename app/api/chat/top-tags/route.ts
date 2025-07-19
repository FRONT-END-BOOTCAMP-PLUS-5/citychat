import { NextRequest, NextResponse } from "next/server";
import { SbTopTagRepository } from "@/backend/infrastructure/repositories/SbTopTagRepository";
import { GetTopTagsByRoomId } from "@/backend/application/top-tags/usecases/GetTopTagsByRoomId";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomIdParam = searchParams.get("roomId");

  const roomId = Number(roomIdParam);

  if (!roomIdParam || isNaN(roomId)) {
    return NextResponse.json(
      { error: "Invalid or missing roomId" },
      { status: 400 }
    );
  }

  const repo = new SbTopTagRepository();
  const usecase = new GetTopTagsByRoomId(repo);

  try {
    const result = await usecase.execute(roomId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("🔥 Failed to get top tags:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

