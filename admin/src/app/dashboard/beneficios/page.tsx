import { createClient } from "@/lib/supabase/server";
import type { Beneficio, Parceiro } from "@/lib/supabase/types";
import { atualizarStatusBeneficio } from "./actions";

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
      <h1 className="font-semibold text-2xl text-[#263f40]">Benefícios</h1>
      <p className="mt-1 text-sm text-[#5c6e6f]">
        Cupons e descontos cadastrados pelos parceiros.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-[#e7e2d6] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f7f8f8] text-xs uppercase text-[#5c6e6f]">
            <tr>
              <th className="px-4 py-3">Benefício</th>
              <th className="px-4 py-3">Parceiro</th>
              <th className="px-4 py-3">Desconto</th>
              <th className="px-4 py-3">Validade</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7e2d6]">
            {beneficios?.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 font-medium text-[#263f40]">{b.titulo}</td>
                <td className="px-4 py-3 text-[#5c6e6f]">
                  {b.parceiros?.nome_negocio ?? "—"}
                </td>
                <td className="px-4 py-3 text-[#5c6e6f]">{formatDesconto(b)}</td>
                <td className="px-4 py-3 text-[#5c6e6f]">
                  {b.validade_fim
                    ? new Date(b.validade_fim).toLocaleDateString("pt-BR")
                    : "Sem validade"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[b.status]}`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {b.status !== "ativo" && (
                      <form action={atualizarStatusBeneficio.bind(null, b.id, "ativo")}>
                        <button className="rounded-lg border border-[#e7e2d6] px-3 py-1.5 text-xs font-medium text-[#425c5a] hover:bg-[#f7f8f8]">
                          Ativar
                        </button>
                      </form>
                    )}
                    {b.status !== "pausado" && (
                      <form action={atualizarStatusBeneficio.bind(null, b.id, "pausado")}>
                        <button className="rounded-lg border border-[#e7e2d6] px-3 py-1.5 text-xs font-medium text-[#425c5a] hover:bg-[#f7f8f8]">
                          Pausar
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!beneficios?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#5c6e6f]">
                  Nenhum benefício cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
