import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // 쿠키 삭제
    cookieStore.delete("access-token");
    cookieStore.delete("refresh-token");

    return NextResponse.json({
      success: true,
      message: "Sign out successful",
    });
  } catch (error: unknown) {
    console.error("Sign out error:", error);
    return NextResponse.json({ error: "Sign out failed" }, { status: 500 });
  }
}
