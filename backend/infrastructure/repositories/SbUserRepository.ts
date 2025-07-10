import { User } from "@/backend/domain/entities/User";
import { UserRepository } from "@/backend/domain/repositories/UserRepository";
import { SupabaseClient } from "@supabase/supabase-js";

interface UserTable {
    id: number;
    user_id: string;
    password: string;
    nickname: string;
    email: string;
    language: "ko" | "en";
    deleted_flag: boolean;
    user_role: "user" | "admin";
}

export class SbUserRepository implements UserRepository {

    constructor(private supabase: SupabaseClient) {}

    private mapToUserTable(user: User): Omit<UserTable, 'id'> {
        return {
            user_id: user.userId,
            password: user.password,
            nickname: user.nickname,
            email: user.email,
            language: user.language,
            deleted_flag: user.deletedFlag,
            user_role: user.userRole,
        };
    }

    private mapToUser(userTable: UserTable): User {
        return new User(
            userTable.id,
            userTable.user_id,
            userTable.password,
            userTable.nickname,
            userTable.email,
            userTable.language,
            userTable.deleted_flag,
            userTable.user_role
        );
    }

    async create(user: User): Promise<User> {
        const userTableData = this.mapToUserTable(user);
        
        const { data, error } = await this.supabase
            .from('users')
            .insert([userTableData])
            .select()
            .single();
            
        if (error) throw new Error(error.message);
        return this.mapToUser(data as UserTable);
    }

    update(user: User): Promise<User> {
        throw new Error("Method not implemented.");
    }
    delete(id: number): Promise<User> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
    findById(id: number): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    async findByUserId(userId: string): Promise<User | null> {
        const { data, error } = await this.supabase
            .from("users")
            .select()
            .eq("user_id", userId)
            .eq('deleted_flag', false)
            .maybeSingle();
        if (error) throw new Error(error.message);
        if (!data) return null;
        return this.mapToUser(data as UserTable);
    }
}
