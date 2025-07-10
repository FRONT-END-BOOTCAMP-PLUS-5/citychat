import { User } from "@/backend/domain/entities/User";

export interface SigninRequestDto {
  userId: string;
  password: string;
}

export interface SigninResponseDto {
  success: boolean;
  message: string;
  user?: Pick<User, "id" | "nickname">;
}
