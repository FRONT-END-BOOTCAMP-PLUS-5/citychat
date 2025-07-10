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
  const { user, setUser } = useUserStore();

  return useMutation({
    mutationFn: (params: SigninRequestDto) => {
      return signin(params);
    },
    onSuccess: (data) => {
      // 로그인 성공 시 처리
      console.log(data.user);
      if (data.user) {
        setUser(data.user); //zustand 스토어에 user 정보 저장
        console.log("zustand user", user);
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
