import { UserRepository } from "@/backend/domain/repositories/UserRepository";
import { UpdateUserRequestDto } from "../dtos/UpdateUserRequestDto";
import { UpdateUserResponseDto } from "../dtos/UpdateUserResponseDto";
import bcrypt from "bcryptjs";

export class UpdateUserUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: UpdateUserRequestDto): Promise<UpdateUserResponseDto> {
    try {
      // 현재 사용자 조회
      const currentUser = await this.userRepository.findOneByCriteria({id: request.id});
      if (!currentUser) {
        return {
          success: false,
          message: "사용자를 찾을 수 없습니다."
        };
      }

      // 닉네임 변경 요청
      if (request.nickname) {
        currentUser.nickname = request.nickname;
        
        const updatedUser = await this.userRepository.update(currentUser);
        
        return {
          success: true,
          message: "닉네임이 성공적으로 변경되었습니다.",
          user: {
            id: updatedUser.id,
            userId: updatedUser.userId,
            nickname: updatedUser.nickname,
            email: updatedUser.email,
            language: updatedUser.language,
            deletedFlag: updatedUser.deletedFlag,
            userRole: updatedUser.userRole
          }
        };
      }

      // 비밀번호 변경 요청
      if (request.currentPassword && request.newPassword) {
        // 현재 비밀번호 검증
        const isValidPassword = await bcrypt.compare(request.currentPassword, currentUser.password);
        if (!isValidPassword) {
          return {
            success: false,
            message: "현재 비밀번호가 일치하지 않습니다."
          };
        }

        // 새 비밀번호 해싱
        const hashedNewPassword = await bcrypt.hash(request.newPassword, 10);
        currentUser.password = hashedNewPassword;
        
        const updatedUser = await this.userRepository.update(currentUser);
        
        return {
          success: true,
          message: "비밀번호가 성공적으로 변경되었습니다.",
          user: {
            id: updatedUser.id,
            userId: updatedUser.userId,
            nickname: updatedUser.nickname,
            email: updatedUser.email,
            language: updatedUser.language,
            deletedFlag: updatedUser.deletedFlag,
            userRole: updatedUser.userRole
          }
        };
      }

      return {
        success: false,
        message: "변경할 정보가 제공되지 않았습니다."
      };

    } catch (error) {
      console.error("UpdateUserUsecase error:", error);
      return {
        success: false,
        message: "사용자 정보 업데이트 중 오류가 발생했습니다."
      };
    }
  }
}
