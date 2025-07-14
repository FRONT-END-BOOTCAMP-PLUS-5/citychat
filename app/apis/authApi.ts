import { SigninRequestDto } from "@/backend/application/auth/dtos/SigninRequestDto";
import { SigninResponseDto } from "@/backend/application/auth/dtos/SigninResponseDto";
import { SignupRequestDto } from "@/backend/application/users/dtos/SignupRequestDto";
import { SignupResponseDto } from "@/backend/application/users/dtos/SignupResponseDto";

export const signin = async (data: SigninRequestDto): Promise<SigninResponseDto> => {
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || errorData.error || "Login failed");
  }

  return response.json();
};

export const signup = async (data: SignupRequestDto): Promise<SignupResponseDto> => {
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
