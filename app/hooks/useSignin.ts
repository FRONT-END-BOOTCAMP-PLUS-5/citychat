import {
  SigninRequestDto,
  SigninResponseDto,
} from "@/backend/application/signin/dtos/SigninDto";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signin } from "../apis/authApi";

export const useSignin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (params: SigninRequestDto) => {
      return signin(params);
    },
    onSuccess: (data) => {
      // 로그인 성공 시 처리
      console.log("Login successful:", data.user);

      // 사용자 정보를 로컬 스토리지에 저장
      localStorage.setItem("user", JSON.stringify(data.user));

      // 홈 페이지로 리다이렉트
      router.push("/");
    },
    onError: (error) => {
      // 로그인 실패 시 처리
      console.error("Login failed:", error);
      // 토스트 메시지 표시 등의 에러 처리
    },
  });
};
