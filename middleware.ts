import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/utils/auth/tokenUtils";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API 경로에 대해서만 토큰 검증
  if (pathname.startsWith("/api")) {
    // 인증이 필요하지 않은 API 경로들
    const publicApiPaths = [
      "/api/auth/signin",
      "/api/users", // 회원가입
      "/api/user/duplicate", // 중복 체크
      "/api/weather", // 날씨 정보
      "/api/translate", // 번역
    ];

    // 공개 API 경로는 통과
    if (publicApiPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // 그 외 API는 토큰 검증 필요
    const accessToken = request.cookies.get("access-token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token required" },
        { status: 401 }
      );
    }

    const verificationResult = verifyAccessToken(accessToken);

    if (!verificationResult.ok) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
