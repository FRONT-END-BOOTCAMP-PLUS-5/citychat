import { UserRepository } from "@/backend/domain/repositories/UserRepository";
import { CheckDuplicateRequestDto, CheckDuplicateResponseDto } from "../dtos/CheckDuplicateDto";
import { GetUserCriteria } from "@/backend/infrastructure/repositories/criteria/GetUserCriteria";

export class CheckDuplicateUsecase {
    constructor(private userRepository: UserRepository) { }

    async execute(request: CheckDuplicateRequestDto): Promise<CheckDuplicateResponseDto> {
        try {
            const criteria: GetUserCriteria = {};

            switch (request.field) {
                case "userId":
                    criteria.userid = request.value;
                    break;
                case "nickname":
                    criteria.nickname = request.value;
                    break;
                case "email":
                    criteria.email = request.value;
                    break;
                default:
                    return {
                        success: false,
                        message: "잘못된 필드입니다.",
                        isDuplicate: false
                    };
            }

            const existingUser = await this.userRepository.findOneByCriteria(criteria);
            const isDuplicate = existingUser !== null;

            return {
                success: true,
                message: isDuplicate ? `이미 사용 중인 ${request.field}입니다.` : `사용 가능한 ${request.field}입니다.`,
                isDuplicate
            };
        } catch (error) {
            console.error("CheckDuplicateUsecase error:", error);
            return {
                success: false,
                message: "중복 확인 중 오류가 발생했습니다.",
                isDuplicate: false
            };
        }
    }
}
