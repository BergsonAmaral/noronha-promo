"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScanLine, History, UserCog } from "lucide-react";

const TABS = [
  { href: "/parceiro", label: "Validar cupom", icon: ScanLine },
  { href: "/parceiro/historico", label: "Histórico", icon: History },
  { href: "/parceiro/perfil", label: "Meu perfil", icon: UserCog },
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-[#e7e2d6] bg-white px-2">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center gap-1 border-b-2 px-2 py-3 text-xs font-medium transition ${
              active
                ? "border-[#df9c28] text-[#263f40]"
                : "border-transparent text-[#9db1b1] hover:text-[#5c6e6f]"
            }`}
          >
            <Icon size={18} strokeWidth={2} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
