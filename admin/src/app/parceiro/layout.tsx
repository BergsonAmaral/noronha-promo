import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import type { Profile, Parceiro } from "@/lib/supabase/types";
import { HOME_BY_ROLE } from "@/lib/role-routing";
import { signOut } from "@/app/login/actions";
import { LogOut, ScanLine } from "lucide-react";
import { NavTabs } from "./nav-tabs";

export default async function ParceiroLayout({
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

  if (!profile || (profile.role !== "parceiro" && profile.role !== "admin")) {
    redirect(HOME_BY_ROLE[profile?.role ?? "cliente"]);
  }

  const { data: negocio } = await supabase
    .from("parceiros")
    .select("id, nome_negocio")
    .eq("user_id", user.id)
    .maybeSingle<Pick<Parceiro, "id" | "nome_negocio">>();

  let mensagensNaoLidas = 0;
  if (negocio) {
    const { count } = await supabase
      .from("mensagens")
      .select("id", { count: "exact", head: true })
      .eq("parceiro_id", negocio.id)
      .eq("remetente_role", "admin")
      .eq("lida", false);
    mensagensNaoLidas = count ?? 0;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8f8]">
      <header className="flex items-center justify-between bg-[#263f40] px-5 py-4">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Noronha Promo" width={34} height={34} />
          <div>
            <p className="font-head text-sm font-bold text-white">
              {negocio?.nome_negocio ?? "Painel do parceiro"}
            </p>
            <p className="flex items-center gap-1 text-[10px] tracking-wider text-[#9db1b1] uppercase">
              <ScanLine size={11} strokeWidth={2} />
              Validação de cupons
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
      <NavTabs mensagensNaoLidas={mensagensNaoLidas} />
      <main className="flex flex-1 items-start justify-center p-5">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
