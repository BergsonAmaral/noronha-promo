import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import type { Profile } from "@/lib/supabase/types";
import { LogOut } from "lucide-react";
import { SignOutButton } from "./sign-out-button";
import { NavLink } from "./nav-link";

const NAV = [
  { href: "/dashboard", label: "Visão geral", icon: "LayoutGrid" },
  { href: "/dashboard/categorias", label: "Categorias", icon: "Tags" },
  { href: "/dashboard/parceiros", label: "Parceiros", icon: "Store" },
  { href: "/dashboard/clientes", label: "Clientes", icon: "UserRound" },
  { href: "/dashboard/beneficios", label: "Benefícios", icon: "Ticket" },
  { href: "/dashboard/avaliacoes", label: "Avaliações", icon: "Star" },
  { href: "/dashboard/mensagens", label: "Mensagens", icon: "MessageCircle" },
  { href: "/dashboard/leads", label: "Leads", icon: "Users" },
  { href: "/dashboard/conta", label: "Minha conta", icon: "Settings" },
] as const;

export default async function DashboardLayout({
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

  if (!profile || profile.role !== "admin") {
    redirect("/login?error=Acesso restrito ao time administrativo");
  }

  return (
    <div className="flex min-h-screen bg-[#f7f8f8]">
      <aside className="flex w-64 flex-shrink-0 flex-col border-r border-[#e7e2d6] bg-[#263f40]">
        <div className="flex items-center gap-3 px-6 py-6">
          <Image src="/logo.png" alt="Noronha Promo" width={38} height={38} />
          <div>
            <p className="font-head text-base font-bold text-white">
              Noronha <span className="text-[#df9c28]">Promo</span>
            </p>
            <p className="text-[10px] tracking-wider text-[#9db1b1] uppercase">
              Painel administrativo
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href} icon={item.icon}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-3 py-4">
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#df9c28] text-xs font-bold text-[#263f40]">
              {profile.nome.charAt(0).toUpperCase()}
            </span>
            <p className="truncate text-sm text-[#d9e5e3]">{profile.nome}</p>
          </div>
          <SignOutButton icon={LogOut} />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
