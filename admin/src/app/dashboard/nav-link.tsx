"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Tags,
  Store,
  Ticket,
  Users,
  UserRound,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  LayoutGrid,
  Tags,
  Store,
  Ticket,
  Users,
  UserRound,
  MessageCircle,
};

export function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: keyof typeof ICONS;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
  const Icon = ICONS[icon];

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-white/10 text-white"
          : "text-[#b7c8c8] hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon
        size={18}
        strokeWidth={2}
        className={active ? "text-[#df9c28]" : "text-[#8ba3a3]"}
      />
      {children}
    </Link>
  );
}
