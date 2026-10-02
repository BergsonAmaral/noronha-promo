"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, LogOut } from "lucide-react";
import { NavLink } from "./nav-link";
import { SignOutButton } from "./sign-out-button";
import type { Profile } from "@/lib/supabase/types";

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

export function DashboardShell({
  profile,
  mensagensNaoLidas = 0,
  children,
}: {
  profile: Profile;
  mensagensNaoLidas?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#f7f8f8]">
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-shrink-0 flex-col border-r border-[#e7e2d6] bg-[#263f40] transition-transform duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-6">
          <Image src="/logo.png" alt="Noronha Promo" width={38} height={38} />
          <div className="min-w-0 flex-1">
            <p className="font-head text-base font-bold text-white">
              Noronha <span className="text-[#df9c28]">Promo</span>
            </p>
            <p className="text-[10px] tracking-wider text-[#9db1b1] uppercase">
              Painel administrativo
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex-shrink-0 text-[#9db1b1] hover:text-white md:hidden"
            aria-label="Fechar menu"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pt-2">
          {NAV.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              badge={item.href === "/dashboard/mensagens" ? mensagensNaoLidas : 0}
            >
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

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-[#e7e2d6] bg-white px-4 py-3 md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="text-[#263f40]"
            aria-label="Abrir menu"
          >
            <Menu size={22} strokeWidth={2} />
          </button>
          <Image src="/logo.png" alt="Noronha Promo" width={28} height={28} />
          <p className="font-head text-sm font-bold text-[#263f40]">
            Noronha <span className="text-[#df9c28]">Promo</span>
          </p>
        </header>
        <main className="flex-1 overflow-y-auto p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
