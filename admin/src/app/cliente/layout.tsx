import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import type { Profile } from "@/lib/supabase/types";
import { HOME_BY_ROLE } from "@/lib/role-routing";
import { signOut } from "@/app/login/actions";
import { LogOut, Sparkles } from "lucide-react";
import { NavTabs } from "./nav-tabs";

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
  return (
    <div className="min-h-screen bg-[#f7f8f8]">
      <header className="flex items-center justify-between bg-[#263f40] px-5 py-4">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Noronha Promo" width={34} height={34} />
          <div>
            <p className="font-head text-sm font-bold text-white">
              Olá, {profile.nome.split(" ")[0]}
            </p>
            <p className="flex items-center gap-1 text-[10px] tracking-wider text-[#9db1b1] uppercase">
              <Sparkles size={11} strokeWidth={2} />
              Clube Noronha Promo
            </p>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[#e0a9a4] hover:bg-white/5"
          >
            <LogOut size={14} strokeWidth={2} />
            Sair
          </button>
        </form>
      </header>
      <NavTabs />
      <main className="mx-auto max-w-md p-5">{children}</main>
    </div>
  );
}
