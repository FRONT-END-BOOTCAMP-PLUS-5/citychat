import { NSigninUsecase } from "@/backend/application/signin/usecases/NSigninUsecase";
import { SbUserRepository } from "@/backend/infrastructure/repositories/SbUserRepository";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { userId, password } = await request.json();

        if (!userId || !password) {
            return new Response(JSON.stringify({ success: false, message: "Invalid input" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const supabase = await createClient();
        const userRepository = new SbUserRepository(supabase);
        const signinUsecase = new NSigninUsecase(userRepository);

        const result = await signinUsecase.execute({ userId, password });

        if (!result.success) {
            return NextResponse.json(
                { error: result.message || "Login Failed" },
                { status: 401 }
            );
        }
        return NextResponse.json({
            user: result.user,
        });

    } catch (error: unknown) {
        console.error("Signin error:", error);
        return NextResponse.json(
            { error: "Login Failed" },
            { status: 500 }
        );
    }
}

