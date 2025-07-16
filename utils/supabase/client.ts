// utils/supabase/publicClient.ts
import { createClient } from "@supabase/supabase-js";

export const publicClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
