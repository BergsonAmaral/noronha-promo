import { createBrowserClient } from "@supabase/ssr";

// Depois de rodar `supabase link`, gere os tipos reais com:
//   supabase gen types typescript --linked > src/lib/supabase/types.ts
// e troque para createBrowserClient<Database>(...) novamente.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
