import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_CONFIG } from "@/config/auth";


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // API 경로가 아닌 경우 통과
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // AUTH_CONFIG에서 인증이 필요한 API 경로들 확인
  const isAuthRequiredPath = AUTH_CONFIG.authRequiredPaths.some(path => pathname.startsWith(path));

  // 인증이 필요하지 않은 API 경로는 토큰 검증 없이 통과
  if (!isAuthRequiredPath) {
    return NextResponse.next();
  }

  // 쿠키에서 토큰 가져오기
  const accessToken = request.cookies.get("access-token")?.value;
  const refreshToken = request.cookies.get("refresh-token")?.value;

  console.log(`API 미들웨어 실행: ${pathname}`);
  console.log("access 토큰:", accessToken ? `있음 (${accessToken.slice(0, 20)}...)` : "없음");
  console.log("refresh 토큰:", refreshToken ? `있음 (${refreshToken.slice(0, 20)}...)` : "없음");

  // access 토큰이 있으면 Authorization 헤더에 추가
  if (accessToken) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // access 토큰이 없고 refresh 토큰이 있으면 재발급 시도
  if (!accessToken && refreshToken) {
    try {
      const refreshResponse = await fetch(new URL("/api/auth/refresh", request.url), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshResponse.json();
        
        if (newAccessToken) {
          const requestHeaders = new Headers(request.headers);
          requestHeaders.set("Authorization", `Bearer ${newAccessToken}`);
          
          const response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });

          // middleware에서 새로운 토큰을 쿠키에 설정
          response.cookies.set("access-token", newAccessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 3600, // 1시간
          });

          if (newRefreshToken) {
            response.cookies.set("refresh-token", newRefreshToken, {
              httpOnly: true,
              secure: true,
              maxAge: 604800, // 7일
            });
          }

          console.log("토큰 재발급 성공 - 쿠키 설정 완료");
          return response;
        }
      }
    } catch (error) {
      console.log("토큰 재발급 실패:", error);
    }
  }

  // 토큰이 없으면 그냥 통과 (각 usecase에서 처리)
  return NextResponse.next();
}

// 미들웨어가 실행될 경로 패턴 설정
export const config = {
  matcher: "/api/:path*",
};
