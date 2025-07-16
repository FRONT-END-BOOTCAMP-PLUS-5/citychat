import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/utils/auth/tokenUtils";
import { AUTH_CONFIG } from "@/config/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API 경로에 대해서만 토큰 검증
  if (pathname.startsWith("/api")) {

    // 공개 API 경로는 통과
    if (AUTH_CONFIG.publicApiPaths.some((path) => pathname.startsWith(path))) {
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

    // if (!verificationResult.ok) {
    //   return NextResponse.json(
    //     { error: "Invalid or expired token" },
    //     { status: 401 }
    //   );
    // }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
// ✅ middleware.ts 에서 matcher에 /api 포함되도록 수정
// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };

