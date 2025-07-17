import { useMutation } from "@tanstack/react-query";
import { signout } from "../apis/authApi";
import { useUserStore } from "../stores/useUserStore";
import { useRouter } from "next/navigation";

export const useSignout = () => {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);
  const setLoggingOut = useUserStore((state) => state.setLoggingOut);

  return useMutation({
    mutationFn: () => {
      return signout();
    },
    onSuccess: () => {
      // 로그아웃 성공 후 AuthGuard 우회하기 위해 isLogginOut 설정
      setLoggingOut(true);
      // 로그아웃 성공 시 사용자 정보 초기화
      clearUser();
      router.replace("/");
    },
    onError: (error) => {
      console.error("Sign out failed:", error);
    },
  });
};
