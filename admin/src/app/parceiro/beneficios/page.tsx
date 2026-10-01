import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Beneficio, Parceiro, Resgate } from "@/lib/supabase/types";
import { Ticket, Tag, TrendingUp, ShoppingBag } from "lucide-react";

type BeneficioComResgates = Beneficio & {
  resgates: Pick<Resgate, "status" | "valor_pago">[];
};

const STATUS_COLOR = {
  ativo: "bg-emerald-50 text-emerald-700",
  pausado: "bg-amber-50 text-amber-700",
  expirado: "bg-[#f7f8f8] text-[#5c6e6f]",
};

function formatMoeda(v: number) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}

function formatDesconto(b: Beneficio) {
  if (!b.valor_desconto) return b.condicoes ?? "—";
  if (b.tipo_desconto === "percentual") return `${b.valor_desconto}% off`;
  if (b.tipo_desconto === "valor_fixo")
    return `R$ ${b.valor_desconto.toFixed(2).replace(".", ",")} off`;
  return b.condicoes ?? "—";
}

export default async function BeneficiosParceiroPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: parceiro } = await supabase
    .from("parceiros")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle<Pick<Parceiro, "id">>();

  if (!parceiro) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="font-head text-xl font-bold text-[#263f40]">Meus benefícios</h1>
        <p className="mt-3 text-sm text-[#5c6e6f]">
          Nenhum negócio vinculado a este usuário ainda.
        </p>
      </div>
    );
  }

  const { data: beneficios } = await supabase
    .from("beneficios")
    .select("*, resgates(status, valor_pago)")
    .eq("parceiro_id", parceiro.id)
    .order("created_at", { ascending: false })
    .returns<BeneficioComResgates[]>();

  function vendidos(b: BeneficioComResgates) {
    return b.resgates.filter((r) => r.status === "pago" || r.status === "utilizado").length;
  }

  function faturamento(b: BeneficioComResgates) {
    return b.resgates
      .filter((r) => r.status === "pago" || r.status === "utilizado")
      .reduce((acc, r) => acc + (r.valor_pago ?? 0), 0);
  }

  const totalVendidos = (beneficios ?? []).reduce((acc, b) => acc + vendidos(b), 0);
  const totalFaturamento = (beneficios ?? []).reduce((acc, b) => acc + faturamento(b), 0);

  return (
    <div>
      <h1 className="font-head text-xl font-bold text-[#263f40]">Meus benefícios</h1>
      <p className="mt-1 mb-5 text-sm text-[#5c6e6f]">
        Cupons anunciados em nome do seu negócio. O cadastro é feito pelo admin —
        fale com o time se quiser ajustar algo.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef4f2] text-[#48696c]">
            <ShoppingBag size={17} strokeWidth={2} />
          </span>
          <p className="mt-3 font-head text-2xl font-bold text-[#263f40]">{totalVendidos}</p>
          <p className="text-xs text-[#5c6e6f]">Cupons vendidos</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#df9c28]/12 text-[#c78716]">
            <TrendingUp size={17} strokeWidth={2} />
          </span>
          <p className="mt-3 font-head text-2xl font-bold text-[#263f40]">
            {formatMoeda(totalFaturamento)}
          </p>
          <p className="text-xs text-[#5c6e6f]">Faturamento</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {beneficios?.map((b) => (
          <div key={b.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#df9c28]/12 text-[#c78716]">
                <Ticket size={17} strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-head text-sm font-semibold text-[#263f40]">
                    {b.titulo}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_COLOR[b.status]}`}
                  >
                    {b.status}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5c6e6f]">
                  <span className="flex items-center gap-1 font-medium text-[#48696c]">
                    <Tag size={12} strokeWidth={2.5} />
                    {formatDesconto(b)}
                  </span>
                  <span>{b.preco > 0 ? formatMoeda(b.preco) : "Grátis"}</span>
                  <span>{vendidos(b)} vendido(s)</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!beneficios?.length && (
          <div className="rounded-2xl border border-dashed border-[#e7e2d6] bg-white p-8 text-center text-sm text-[#5c6e6f]">
            Nenhum benefício cadastrado ainda para o seu negócio.
          </div>
        )}
      </div>
    </div>
  );
}
