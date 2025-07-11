import {
  SigninRequestDto,
  SigninResponseDto,
} from "@/backend/application/signin/dtos/SigninDto";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signin } from "../apis/authApi";
import { useUserStore } from "../stores/useUserStore";

export const useSignin = () => {
  const router = useRouter();
  // const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: (params: SigninRequestDto) => {
      return signin(params);
    },
    onSuccess: (data) => {
      // 로그인 성공 시
      if (data.user) {
        // setUser(data.user); // ✅ 전역 상태에 유저 저장
        console.log("hook에서 정보", data.user);
      }
      router.push("/");
    },
    onError: (error) => {
      // 로그인 실패 시 처리
      console.error("Login failed:", error);
      // 토스트 메시지 표시 등의 에러 처리
    },
  });
};
