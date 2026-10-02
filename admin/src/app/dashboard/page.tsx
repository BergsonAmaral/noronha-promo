import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Tags, Store, Clock, Ticket, Users, ShoppingBag, Wallet, UserRound, type LucideIcon } from "lucide-react";

async function getCounts() {
  const supabase = await createClient();

  const [categorias, parceiros, parceirosPendentes, beneficios, leads, resgates, clientes] = await Promise.all([
    supabase.from("categorias").select("id", { count: "exact", head: true }),
    supabase.from("parceiros").select("id", { count: "exact", head: true }),
    supabase
      .from("parceiros")
      .select("id", { count: "exact", head: true })
      .eq("status", "pendente"),
    supabase.from("beneficios").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("resgates").select("status, valor_pago"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "cliente"),
  ]);
  const vendas = (resgates.data ?? []).filter((r) => r.status === "pago" || r.status === "utilizado");

  return {
    categorias: categorias.count ?? 0,
    parceiros: parceiros.count ?? 0,
    parceirosPendentes: parceirosPendentes.count ?? 0,
    beneficios: beneficios.count ?? 0,
    leads: leads.count ?? 0,
    clientes: clientes.count ?? 0,
    vendas: vendas.length,
    usados: vendas.filter((r) => r.status === "utilizado").length,
    faturamento: vendas.reduce((acc, r) => acc + Number(r.valor_pago ?? 0), 0),
  };
}

export default async function DashboardPage() {
  const counts = await getCounts();

  const cards: {
    label: string;
    value: number;
    money?: boolean;
    href: string;
    icon: LucideIcon;
    highlight?: boolean;
  }[] = [
    { label: "Categorias", value: counts.categorias, href: "/dashboard/categorias", icon: Tags },
    { label: "Parceiros", value: counts.parceiros, href: "/dashboard/parceiros", icon: Store },
    {
      label: "Parceiros pendentes",
      value: counts.parceirosPendentes,
      href: "/dashboard/parceiros?status=pendente",
      icon: Clock,
      highlight: counts.parceirosPendentes > 0,
    },
    {
      label: "Benefícios cadastrados",
      value: counts.beneficios,
      href: "/dashboard/beneficios",
      icon: Ticket,
    },
    { label: "Leads cadastrados", value: counts.leads, href: "/dashboard/leads", icon: Users },
    { label: "Clientes", value: counts.clientes, href: "/dashboard/clientes", icon: UserRound },
    { label: "Cupons vendidos", value: counts.vendas, href: "/dashboard/beneficios", icon: ShoppingBag },
    { label: "Cupons utilizados", value: counts.usados, href: "/dashboard/beneficios", icon: Ticket },
    {
      label: "Faturamento (teste)",
      value: counts.faturamento,
      money: true,
      href: "/dashboard/beneficios",
      icon: Wallet,
    },
  ];

  return (
    <div>
      <h1 className="font-head text-2xl font-bold text-[#263f40]">Visão geral</h1>
      <p className="mt-1 text-sm text-[#5c6e6f]">
        Resumo do que está acontecendo no clube agora.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`group flex items-start justify-between rounded-xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${
              card.highlight
                ? "border-[#df9c28]/40 bg-[#df9c28]/5"
                : "border-[#e7e2d6] bg-white"
            }`}
          >
            <div>
              <p className="text-sm text-[#5c6e6f]">{card.label}</p>
              <p className="mt-2 font-head text-3xl font-bold text-[#263f40]">
                {card.money ? `R$ ${card.value.toFixed(2).replace(".", ",")}` : card.value}
              </p>
            </div>
            <span
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                card.highlight
                  ? "bg-[#df9c28]/15 text-[#c78716]"
                  : "bg-[#eef4f2] text-[#48696c]"
              }`}
            >
              <card.icon size={20} strokeWidth={2} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
