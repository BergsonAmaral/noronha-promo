import type { UserRole } from "@/lib/supabase/types";

// Único login para os 3 públicos (cliente, parceiro, admin) — este mapa
// decide pra onde cada papel vai depois de autenticar.
export const HOME_BY_ROLE: Record<UserRole, string> = {
  admin: "/dashboard",
  parceiro: "/parceiro",
  cliente: "/cliente",
};
