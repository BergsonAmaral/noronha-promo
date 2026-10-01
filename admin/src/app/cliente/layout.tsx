import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile } from "@/lib/supabase/types";
import { HOME_BY_ROLE } from "@/lib/role-routing";

export default async function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!profile) redirect("/login");

  // Admin também pode espiar o portal do cliente; qualquer papel
  // válido chega até aqui pois este é o destino padrão (fallback).
  return <div className="min-h-screen bg-[#f7f8f8]">{children}</div>;
}
