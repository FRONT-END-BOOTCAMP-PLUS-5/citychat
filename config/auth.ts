export const AUTH_CONFIG = {
  // 인증이 필요하지 않은 공개 API 경로들
  publicApiPaths: [
    "/api/auth/signin",
    "/api/users", // 회원가입
    "/api/user/duplicate", // 중복 체크
    "/api/weather", // 날씨 정보
    "/api/translate", // 번역
    "/api/cities", // 도시 정보
  ],

  // 로그인이 필요한 보호된 페이지 경로들
  protectedPaths: [
    "/me",
    "/chatrooms",
  ],

  // 로그인한 사용자가 접근하면 안 되는 페이지들 (로그인/회원가입)
  authPaths: [
    "/signin", 
    "/signup",
  ],

} as const;
