import { GetUserCriteria } from "@/backend/infrastructure/repositories/criteria/GetUserCriteria";
import { User } from "../entities/User";

export interface UserRepository {
    // 사용자 생성
    create(user: User): Promise<User>;
    // 사용자 수정
    update(user: User): Promise<User>;
    // 사용자 삭제
    delete(id: number): Promise<User>;

    // 사용자 단일 조회 (조건 이용)
    // 조건 : id, 사용자 id, 닉네임, 이메일
    findOneByCriteria(criteria: GetUserCriteria): Promise<User | null>;
}
