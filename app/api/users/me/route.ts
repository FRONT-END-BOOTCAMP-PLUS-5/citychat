import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { verifyAccessToken } from "@/utils/auth/tokenUtils";
import { UpdateUserUsecase } from "@/backend/application/users/usecases/UpdateUserUsecase";
import { SbUserRepository } from "@/backend/infrastructure/repositories/SbUserRepository";
import { UpdateUserRequestDto } from "@/backend/application/users/dtos/UpdateUserRequestDto";

// PATCH /api/users/me
export async function PATCH(request: NextRequest) {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "인증 토큰이 필요합니다." },
        { status: 401 }
      );
    }

    // 토큰 검증
    const tokenResult = verifyAccessToken(token);
    if (!tokenResult.ok || !tokenResult.payload) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 토큰입니다." },
        { status: 401 }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { nickname, currentPassword, newPassword } = body;

    // 사용자 ID를 토큰에서 추출
    const userId = tokenResult.payload.userInfo.id;

    const updateRequest: UpdateUserRequestDto = {
      id: userId,
      nickname,
      currentPassword,
      newPassword
    };

    // UseCase 실행
    const supabase = await createClient();
    const userRepository = new SbUserRepository(supabase);
    const updateUserUsecase = new UpdateUserUsecase(userRepository);

    const result = await updateUserUsecase.execute(updateRequest);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400
    });

  } catch (error) {
    console.error("PATCH /api/users/me error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
