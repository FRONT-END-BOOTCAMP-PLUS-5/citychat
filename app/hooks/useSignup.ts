import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SignupRequestDto } from "@/backend/application/users/dtos/SignupRequestDto";
import { SignupResponseDto } from "@/backend/application/users/dtos/SignupResponseDto";

const signup = async (data: SignupRequestDto): Promise<SignupResponseDto> => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || errorData.error || "회원가입에 실패했습니다.");
  }

  return response.json();
};

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
