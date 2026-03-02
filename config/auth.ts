export const AUTH_CONFIG = {
  // API 호출 시, 토큰 확인이 필요한 api 경로들
  authRequiredPaths: [
    "/api/user/chats",
    "/api/users/me", // 사용자 정보 수정
    //"/api/chat/logs", // 채팅 로그 조회
  ],

  // 로그인이 필요한 보호된 페이지 경로들
  protectedPaths: [
    "/me",
    "/chatrooms",
  ],

  // 로그인한 사용자가 접근하면 안 되는 페이지들 (로그인/회원가입)
  guestOnlyPaths: [
    "/signin",
    "/signup",
  ],

} as const;
