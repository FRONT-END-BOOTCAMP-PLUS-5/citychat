import { User } from "@/backend/domain/entities/User";

export interface SignupResponseDto {
  success: boolean;
  message: string;
  user?: Omit<User, "password">;
}
