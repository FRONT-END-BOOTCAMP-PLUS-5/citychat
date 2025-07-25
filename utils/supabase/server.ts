import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_SUPABASE_ANON_KEY!;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        // return cookieStore.getAll();
        return [
          {name: "sb-access-token", value: cookieStore.get("access-token")?.value || "" },
          {name: "sb-refresh-token", value: cookieStore.get("refresh-token")?.value || ""},
        ];
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
