import { UserRepository } from "@/backend/domain/repositories/UserRepository";
import { SigninRequestDto, SigninResponseDto } from "../dtos/SigninDto";
import { useStyleRegistry } from "styled-jsx";

export class NSigninUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: SigninRequestDto): Promise<SigninResponseDto> {
    const { userId, password } = request;

    // 사용자 조회
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      return {
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      };
    }

    // 비밀번호 확인
    if (user.password !== password) {
      return {
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
      };
    }

    // 비밀번호를 제외한 사용자 정보 반환
    const { id, nickname } = user;
    const userInfo = { id, nickname };

    return {
      success: true,
      message: "로그인 성공",
      user: userInfo,
    };
  }
}
