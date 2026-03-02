import { SigninRequestDto } from "@/backend/application/auth/dtos/SigninRequestDto";
import { SigninResponseDto } from "@/backend/application/auth/dtos/SigninResponseDto";
import { useUserStore } from "@/stores/useUserStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const signin = async (data: SigninRequestDto): Promise<SigninResponseDto> => {
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || errorData.error || "로그인에 실패했습니다.");
  }

  return response.json();
};

export const useSignin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (params: SigninRequestDto) => {
      return signin(params);
    },
    onSuccess: (data) => {
      if (data.user) {
        useUserStore.getState().setUser(data.user);
      }
      router.push("/");
    },
  });
};
