/* eslint-disable @typescript-eslint/no-unused-vars */
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { SignupRequestDto } from "@/backend/application/users/dtos/SignupRequestDto";
import { SignupUsecase } from "@/backend/application/users/usecases/SignupUsecase";
import { SbUserRepository } from "@/backend/infrastructure/repositories/SbUserRepository";

// GET /api/users
export async function GET(request: NextRequest) {
  const supabase: SupabaseClient = await createClient();
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// POST /api/users
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
