import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { SbUserRepository } from "@/backend/infrastructure/repositories/SbUserRepository";
import { SignupUsecase } from "@/backend/application/user/usecases/SignupUsecase";
import { SignupRequestDto } from "@/backend/application/user/dtos/SignupDto";

export async function POST(request: NextRequest) {
    try {
        const body: SignupRequestDto = await request.json();
        
        const supabase = await createClient();
        const userRepository = new SbUserRepository(supabase);
        const signupUsecase = new SignupUsecase(userRepository);
        
        const result = await signupUsecase.execute(body);
        
        return NextResponse.json(result, { 
            status: result.success ? 201 : 400 
        });
    } catch (error) {
        return NextResponse.json(
            { 
                success: false, 
                message: "서버 오류가 발생했습니다." 
            },
            { status: 500 }
        );
    }
}
