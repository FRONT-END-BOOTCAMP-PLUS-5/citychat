import { SigninRequestDto, SigninResponseDto } from "@/backend/application/auth/dtos/SigninDto";
import { SignupRequestDto, SignupResponseDto } from "@/backend/application/user/dtos/SignupDto";

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
  const response = await fetch("/api/users/signup", {
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
