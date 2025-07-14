import { User } from "@/backend/domain/entities/User";

export interface SignupRequestDto {
  userId: string;
  password: string;
  nickname: string;
  email: string;
}

export interface SignupResponseDto {
  success: boolean;
  message: string;
  user?: Omit<User, "password">;
}
