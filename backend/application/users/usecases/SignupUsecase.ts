import { User } from "@/backend/domain/entities/User";
import { UserRepository } from "@/backend/domain/repositories/UserRepository";
import { SignupRequestDto } from "../dtos/SignupRequestDto";
import { SignupResponseDto } from "../dtos/SignupResponseDto";
import bcrypt from "bcryptjs";

export class SignupUsecase {
    constructor(private userRepository: UserRepository) { }

    async execute(request: SignupRequestDto): Promise<SignupResponseDto> {
        try {
            const existingUser = await this.userRepository.findByUserId(request.userId);
            if (existingUser) {
                return {
                    success: false,
                    message: "이미 존재하는 사용자 ID입니다."
                };
            }

            const hashedPassword = await bcrypt.hash(request.password, 10);

            const newUser = new User(
                0,
                request.userId,
                hashedPassword,
                request.nickname,
                request.email,
                "ko",
                false,
                "user"
            );

            const createdUser = await this.userRepository.create(newUser);

            const { password: _, ...userWithoutPassword } = createdUser;

            return {
                success: true,
                message: "회원가입이 완료되었습니다.",
                user: userWithoutPassword,
            };
        } catch (error) {
            return {
                success: false,
                message: "회원가입 중 오류가 발생했습니다."
            };
        }
    }
}
