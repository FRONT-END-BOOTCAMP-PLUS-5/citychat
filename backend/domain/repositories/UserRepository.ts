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
    findOneByCriteria(criteria: GetUserCriteria): Promise<User | null>;

    // 전체 조회
    findAll(): Promise<User[]>;
    // ID로 조회
    findById(id: number): Promise<User | null>;
    // 사용자 ID로 조회
    findByUserId(userId: string): Promise<User | null>;
}
