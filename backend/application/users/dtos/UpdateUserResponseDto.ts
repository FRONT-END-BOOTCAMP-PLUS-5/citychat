import { User } from "@/backend/domain/entities/User";

export interface UpdateUserResponseDto {
  success: boolean;
  message: string;
  user?: Omit<User, "password">;
}
