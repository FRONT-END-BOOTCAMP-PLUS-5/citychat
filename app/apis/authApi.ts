import { SigninRequestDto } from "@/backend/application/auth/dtos/SigninRequestDto";
import { SigninResponseDto } from "@/backend/application/auth/dtos/SigninResponseDto";
import { SignupRequestDto } from "@/backend/application/users/dtos/SignupRequestDto";
import { SignupResponseDto } from "@/backend/application/users/dtos/SignupResponseDto";
import { UpdateUserRequestDto } from "@/backend/application/users/dtos/UpdateUserRequestDto";
import { UpdateUserResponseDto } from "@/backend/application/users/dtos/UpdateUserResponseDto";

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
    throw new Error(errorData.message || errorData.error || "Signin failed");
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

export const signout = async (): Promise<{ success: boolean; message: string }> => {
  const response = await fetch("/api/auth/signout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || errorData.error || "Sign out failed");
  }

  return response.json();
};

export const updateUserNickname = async (nickname: string): Promise<UpdateUserResponseDto> => {
  const response = await fetch("/api/users/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nickname }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || errorData.error || "닉네임 변경에 실패했습니다.");
  }

  return response.json();
};

export const updateUserPassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<UpdateUserResponseDto> => {
  const response = await fetch("/api/users/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || errorData.error || "비밀번호 변경에 실패했습니다.");
  }

  return response.json();
};
