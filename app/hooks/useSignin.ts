import { SigninRequestDto } from "@/backend/application/auth/dtos/SigninRequestDto";
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
      // 로그인 성공 시
      if (data.user) {
        console.log("hook에서 정보", data.user);
      }
      router.push("/");
    },
    onError: (error) => {
      // 로그인 실패 시 처리
      console.error("Login failed:", error);
    },
  });
};
