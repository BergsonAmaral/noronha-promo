import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  const supabase = await createClient();

  const [categorias, parceiros, parceirosPendentes, beneficios, leads, solicitacoes] =
    await Promise.all([
      supabase.from("categorias").select("id", { count: "exact", head: true }),
      supabase.from("parceiros").select("id", { count: "exact", head: true }),
      supabase
        .from("parceiros")
        .select("id", { count: "exact", head: true })
        .eq("status", "pendente"),
      supabase.from("beneficios").select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase
        .from("solicitacoes_parceiro")
        .select("id", { count: "exact", head: true })
        .eq("status", "pendente"),
    ]);

  return {
    categorias: categorias.count ?? 0,
    parceiros: parceiros.count ?? 0,
    parceirosPendentes: parceirosPendentes.count ?? 0,
    beneficios: beneficios.count ?? 0,
    leads: leads.count ?? 0,
    solicitacoes: solicitacoes.count ?? 0,
  };
}

export default async function DashboardPage() {
  const counts = await getCounts();

  const cards = [
    { label: "Categorias", value: counts.categorias, href: "/dashboard/categorias" },
    { label: "Parceiros", value: counts.parceiros, href: "/dashboard/parceiros" },
    {
      label: "Parceiros pendentes",
      value: counts.parceirosPendentes,
      href: "/dashboard/parceiros?status=pendente",
      highlight: counts.parceirosPendentes > 0,
    },
    { label: "Benefícios ativos", value: counts.beneficios, href: "/dashboard/beneficios" },
    { label: "Leads cadastrados", value: counts.leads, href: "/dashboard/leads" },
    {
      label: "Solicitações de parceria",
      value: counts.solicitacoes,
      href: "/dashboard/solicitacoes",
      highlight: counts.solicitacoes > 0,
    },
  ];

  return (
    <div>
      <h1 className="font-semibold text-2xl text-[#263f40]">Visão geral</h1>
      <p className="mt-1 text-sm text-[#5c6e6f]">
        Resumo do que está acontecendo no clube agora.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className={`rounded-xl border p-5 transition hover:shadow-md ${
              card.highlight
                ? "border-[#df9c28]/40 bg-[#df9c28]/5"
                : "border-[#e7e2d6] bg-white"
            }`}
          >
            <p className="text-sm text-[#5c6e6f]">{card.label}</p>
            <p className="mt-2 font-semibold text-3xl text-[#263f40]">{card.value}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
