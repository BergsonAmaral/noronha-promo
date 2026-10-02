"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ticket, Compass, MessageCircle, UserRound } from "lucide-react";

const TABS = [
  { href: "/cliente", label: "Meus cupons", icon: Ticket },
  { href: "/cliente/descobrir", label: "Descobrir", icon: Compass },
  { href: "/cliente/mensagens", label: "Mensagens", icon: MessageCircle },
  { href: "/cliente/perfil", label: "Meu perfil", icon: UserRound },
];

export function NavTabs({ mensagensNaoLidas = 0 }: { mensagensNaoLidas?: number }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-[#e7e2d6] bg-white px-2">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        const Icon = tab.icon;
        const mostrarBadge = tab.href === "/cliente/mensagens" && mensagensNaoLidas > 0;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative flex flex-1 flex-col items-center gap-1 border-b-2 px-1.5 py-3 text-[11px] font-medium transition ${
              active
                ? "border-[#df9c28] text-[#263f40]"
                : "border-transparent text-[#9db1b1] hover:text-[#5c6e6f]"
            }`}
          >
            <span className="relative">
              <Icon size={18} strokeWidth={2} />
              {mostrarBadge && (
                <span className="absolute -top-1 -right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#df9c28] text-[9px] font-bold text-white">
                  {mensagensNaoLidas > 9 ? "9+" : mensagensNaoLidas}
                </span>
              )}
            </span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
