import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { SbUserRepository } from "@/backend/infrastructure/repositories/SbUserRepository";
import { CheckDuplicateUsecase } from "@/backend/application/user/usecases/CheckDuplicateUsecase";
import { CheckDuplicateRequestDto } from "@/backend/application/user/dtos/CheckDuplicateDto";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const field = searchParams.get("field") as "userId" | "nickname" | "email";
    const value = searchParams.get("value");
        
    console.log("field:", field, "value:", value);
        
    if (!field || !value) {
      return NextResponse.json(
        { 
          success: false, 
          message: "field와 value 파라미터가 필요합니다.",
          isDuplicate: false
        },
        { status: 400 }
      );
    }

    const requestDto: CheckDuplicateRequestDto = { field, value };
        
    const supabase = await createClient();
    const userRepository = new SbUserRepository(supabase);
    const checkDuplicateUsecase = new CheckDuplicateUsecase(userRepository);
        
    const result = await checkDuplicateUsecase.execute(requestDto);
        
    return NextResponse.json(result);
  } catch (error) {
    console.error("Check duplicate error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "서버 오류가 발생했습니다.",
        isDuplicate: false
      },
      { status: 500 }
    );
  }
}
