import { SbUserRepository } from "@/backend/infrastructure/repositories/SbUserRepository";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@/utils/auth/tokenUtils";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        { error: "refresh 토큰이 제공되지 않았습니다" },
        { status: 400 }
      );
    }

    // refresh 토큰 검증
    const verification = verifyRefreshToken(refreshToken);

    if (!verification.ok) {
      return NextResponse.json(
        { error: "유효하지 않은 refresh 토큰입니다" },
        { status: 401 }
      );
    }

    // 사용자 정보 조회
    if (!verification.payload || !verification.payload.id) {
      return NextResponse.json(
        { error: "토큰 payload가 올바르지 않습니다" },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    const userRepository = new SbUserRepository(supabase);
    const user = await userRepository.findOneByCriteria({id: verification.payload.id});

    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 새로운 access 토큰과 refresh 토큰 발급
    const newAccessToken = generateAccessToken({ userInfo: user });
    const newRefreshToken = generateRefreshToken({ id: verification.payload.id });

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      message: "토큰 재발급 성공",
    });

  } catch (error: unknown) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "토큰 재발급 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
