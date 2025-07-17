import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signout } from "../apis/authApi";
import { useUserStore } from "../stores/useUserStore";

export const useSignout = () => {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);

  return useMutation({
    mutationFn: () => {
      return signout();
    },
    onSuccess: () => {
      // 로그아웃 성공 시 사용자 정보 초기화
      clearUser();
      
      router.push("/");
    },
    onError: (error) => {
      console.error("Sign out failed:", error);
    },
  });
};
