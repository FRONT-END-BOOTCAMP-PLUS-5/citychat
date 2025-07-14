import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

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
