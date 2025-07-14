import { UserRepository } from "@/backend/domain/repositories/UserRepository";
import { SigninRequestDto, SigninResponseDto } from "../dtos/SigninDto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/jwt/tokenManager";
import bcrypt from "bcryptjs";

export class SigninUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: SigninRequestDto): Promise<SigninResponseDto> {
    const { userId, password } = request;

    try {
      // 사용자 조회
      const user = await this.userRepository.findByUserId(userId);
      if (!user) {
        return {
          success: false,
          message: "로그인 정보가 올바르지 않습니다.",
        };
      }

      // 비밀번호 검증
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: "로그인 정보가 올바르지 않습니다.",
        };
      }

      // 비밀번호를 제외한 사용자 정보 반환
      const { password: _, ...userWithoutPassword } = user;

      const accessToken = generateAccessToken({ userInfo: userWithoutPassword });
      const refreshToken = generateRefreshToken({ id: user.id });

      return {
        success: true,
        message: "로그인 성공",
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: userWithoutPassword,
      };
    } catch (error) {
      return {
        success: false,
        message: "로그인 처리 중 오류가 발생했습니다.",
      };
    }
  }
}
