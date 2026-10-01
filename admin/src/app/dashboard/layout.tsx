import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/app/login/actions";
import type { Profile } from "@/lib/supabase/types";

const NAV = [
  { href: "/dashboard", label: "Visão geral" },
  { href: "/dashboard/categorias", label: "Categorias" },
  { href: "/dashboard/parceiros", label: "Parceiros" },
  { href: "/dashboard/beneficios", label: "Benefícios" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/solicitacoes", label: "Solicitações de parceria" },
];

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
      <aside className="flex w-64 flex-shrink-0 flex-col border-r border-[#e7e2d6] bg-white">
        <div className="px-6 py-6">
          <p className="font-semibold text-[#263f40]">Noronha Promo</p>
          <p className="text-xs text-[#5c6e6f]">Painel administrativo</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#425c5a] transition hover:bg-[#eef4f2] hover:text-[#263f40]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-[#e7e2d6] px-3 py-4">
          <p className="truncate px-3 text-xs text-[#5c6e6f]">{profile.nome}</p>
          <form action={signOut}>
            <button
              type="submit"
              className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#b3261e] transition hover:bg-red-50"
            >
              Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
