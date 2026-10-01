import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Depois de rodar `supabase link`, gere os tipos reais com:
//   supabase gen types typescript --linked > src/lib/supabase/types.ts
// e troque para createServerClient<Database>(...) novamente.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // chamado de um Server Component — o middleware cuida do refresh da sessão
          }
        },
      },
    }
  );
}
