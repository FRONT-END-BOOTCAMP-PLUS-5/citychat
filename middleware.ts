import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_CONFIG } from "@/config/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 경로 유형 확인
  const isApiPath = pathname.startsWith("/api/");
  const isProtectedPath = AUTH_CONFIG.protectedPaths.some(path => pathname.startsWith(path));
  const isGuestOnlyPaths = AUTH_CONFIG.guestOnlyPaths.some(path => pathname.startsWith(path));
  const isAuthRequiredApi = AUTH_CONFIG.authRequiredPaths.some(path => pathname.startsWith(path));

  // 2. 인증이 필요 없는 경로는 바로 통과
  if (!isProtectedPath && !isGuestOnlyPaths && !isAuthRequiredApi) {
    return NextResponse.next();
  }

  // 3. 인증이 필요한 경로만 토큰 확인
  let accessToken = request.cookies.get("access-token")?.value;
  let refreshToken = request.cookies.get("refresh-token")?.value;

  const response = NextResponse.next();

  // 4. access 토큰이 없고 refresh 토큰이 있으면 재발급 시도
  if (!accessToken && refreshToken) {
    const refreshResult = await tryRefreshToken(request, refreshToken);
    if (refreshResult) {
      accessToken = refreshResult.accessToken;
      refreshToken = refreshResult.refreshToken;

      // 새로운 토큰을 쿠키에 설정
      response.cookies.set("access-token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600,
      });
      response.cookies.set("refresh-token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 604800,
      });
    }
  }

  // 5. 페이지 요청 처리
  if (!isApiPath) {
    // 보호된 페이지인데 토큰이 없으면 로그인 페이지로
    if (isProtectedPath && !accessToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/signin";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // 로그인/회원가입 페이지인데 토큰이 있으면 메인 페이지로
    if (isGuestOnlyPaths && accessToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return response;
  }

  // 6. API 요청 처리
  if (isAuthRequiredApi && accessToken) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return response;
}

// refresh 토큰으로 access 토큰 재발급
async function tryRefreshToken(
  request: NextRequest,
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const refreshResponse = await fetch(
      new URL("/api/auth/refresh", request.url),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!refreshResponse.ok) return null;

    const data = await refreshResponse.json();
    if (data.accessToken) {
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || refreshToken,
      };
    }
    return null;
  } catch {
    return null;
  }
}

// 미들웨어가 실행될 경로 패턴 설정
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth/refresh|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
