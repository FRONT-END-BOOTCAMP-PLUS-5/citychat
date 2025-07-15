import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signup } from "../apis/authApi";
import { SignupRequestDto } from "@/backend/application/users/dtos/SignupRequestDto";

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (params: SignupRequestDto) => {
      return signup(params);
    },
    onSuccess: (data) => {
      // 회원가입 성공 시 로그인 페이지로 이동
      console.log("회원가입 성공:", data);
      router.push("/signin");
    },
    onError: (error: Error) => {
      // 회원가입 실패 시 처리
      console.error("회원가입 실패:", error);
    },
  });
};
