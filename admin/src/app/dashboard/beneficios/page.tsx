import { createClient } from "@/lib/supabase/server";
import type { Beneficio, Parceiro } from "@/lib/supabase/types";
import { atualizarStatusBeneficio } from "./actions";
import { Play, Pause, Ticket, CalendarDays } from "lucide-react";

const STATUS_COLOR = {
  ativo: "bg-emerald-50 text-emerald-700",
  pausado: "bg-amber-50 text-amber-700",
  expirado: "bg-[#f7f8f8] text-[#5c6e6f]",
};

function formatDesconto(b: Beneficio) {
  if (!b.valor_desconto) return b.condicoes ?? "—";
  if (b.tipo_desconto === "percentual") return `${b.valor_desconto}% off`;
  if (b.tipo_desconto === "valor_fixo")
    return `R$ ${b.valor_desconto.toFixed(2).replace(".", ",")} off`;
  return b.condicoes ?? "—";
}

export default async function BeneficiosPage() {
  const supabase = await createClient();
  const { data: beneficios } = await supabase
    .from("beneficios")
    .select("*, parceiros(nome_negocio)")
    .order("created_at", { ascending: false })
    .returns<(Beneficio & { parceiros: Pick<Parceiro, "nome_negocio"> | null })[]>();

  return (
    <div>
      <h1 className="font-head text-2xl font-bold text-[#263f40]">Benefícios</h1>
      <p className="mt-1 text-sm text-[#5c6e6f]">
        Cupons e descontos cadastrados pelos parceiros.
      </p>

      <div className="mt-6 grid gap-4">
        {beneficios?.map((b) => (
          <div key={b.id} className="rounded-xl border border-[#e7e2d6] bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#df9c28]/12 text-[#c78716]">
                  <Ticket size={19} strokeWidth={2} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-head font-semibold text-[#263f40]">{b.titulo}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[b.status]}`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#5c6e6f]">
                    {b.parceiros?.nome_negocio ?? "Sem parceiro"} ·{" "}
                    {formatDesconto(b)}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-[#5c6e6f]">
                    <CalendarDays size={14} strokeWidth={2} />
                    {b.validade_fim
                      ? `Válido até ${new Date(b.validade_fim).toLocaleDateString("pt-BR")}`
                      : "Sem validade definida"}
                  </p>
                </div>
              </div>

              <div className="flex flex-shrink-0 gap-2">
                {b.status !== "ativo" && (
                  <form action={atualizarStatusBeneficio.bind(null, b.id, "ativo")}>
                    <button className="flex items-center gap-1.5 rounded-lg border border-[#e7e2d6] px-3 py-1.5 text-xs font-medium text-[#425c5a] hover:bg-[#f7f8f8]">
                      <Play size={13} strokeWidth={2} />
                      Ativar
                    </button>
                  </form>
                )}
                {b.status !== "pausado" && (
                  <form action={atualizarStatusBeneficio.bind(null, b.id, "pausado")}>
                    <button className="flex items-center gap-1.5 rounded-lg border border-[#e7e2d6] px-3 py-1.5 text-xs font-medium text-[#425c5a] hover:bg-[#f7f8f8]">
                      <Pause size={13} strokeWidth={2} />
                      Pausar
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ))}

        {!beneficios?.length && (
          <div className="rounded-xl border border-dashed border-[#e7e2d6] bg-white p-8 text-center text-[#5c6e6f]">
            Nenhum benefício cadastrado ainda.
          </div>
        )}
      </div>
    </div>
  );
}
