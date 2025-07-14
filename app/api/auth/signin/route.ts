import { SigninUsecase } from "@/backend/application/auth/usecases/SigninUsecase";
import { SbUserRepository } from "@/backend/infrastructure/repositories/SbUserRepository";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json();

    // id 또는 password가 비어있는지 확인
    if (!userId || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "ID와 비밀번호를 필수로 입력하세요.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const supabase = await createClient();
    const userRepository = new SbUserRepository(supabase);
    const signinUsecase = new SigninUsecase(userRepository);

    const result = await signinUsecase.execute({ userId, password });

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Login Failed" },
        { status: 401 }
      );
    }

    // 로그인 성공 시 쿠키에 access token 저장
    const cookieStore = await cookies();
    if (result.success && result.accessToken)
      cookieStore.set("access-token", result.accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600, // 1시간
      });
    if (result.success && result.refreshToken)
      cookieStore.set("refresh-token", result.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 604800, // 7일
      });

    return NextResponse.json({
      user: result.user,
      message: result.message || "Login Successful",
    });
  } catch (error: unknown) {
    console.error("Signin error:", error);
    return NextResponse.json({ error: "Login Failed" }, { status: 500 });
  }
}
