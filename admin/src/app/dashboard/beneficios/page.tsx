import { ImageUpload } from "@/components/image-upload";
import { createClient } from "@/lib/supabase/server";
import type { Beneficio, Parceiro, Categoria } from "@/lib/supabase/types";
import { atualizarStatusBeneficio, criarBeneficio, excluirBeneficio } from "./actions";
import { GerarCupomTeste } from "@/components/gerar-cupom-teste";
import { Play, Pause, Ticket, CalendarDays, Plus, Trash2, Tag } from "lucide-react";

const STATUS_COLOR = {
  ativo: "bg-emerald-50 text-emerald-700",
  pausado: "bg-amber-50 text-amber-700",
  expirado: "bg-[#f7f8f8] text-[#5c6e6f]",
};

function formatPreco(v: number) {
  return v > 0 ? `R$ ${v.toFixed(2).replace(".", ",")}` : "Gratuito";
}

function formatDesconto(b: Beneficio) {
  if (!b.valor_desconto) return b.condicoes ?? "—";
  if (b.tipo_desconto === "percentual") return `${b.valor_desconto}% off`;
  if (b.tipo_desconto === "valor_fixo")
    return `R$ ${b.valor_desconto.toFixed(2).replace(".", ",")} off`;
  return b.condicoes ?? "—";
}

function formatValorComDesconto(b: Beneficio) {
  if (!b.valor_original) return null;
  const final =
    b.tipo_desconto === "percentual" && b.valor_desconto
      ? b.valor_original * (1 - b.valor_desconto / 100)
      : b.tipo_desconto === "valor_fixo" && b.valor_desconto
        ? b.valor_original - b.valor_desconto
        : null;
  if (final == null) return null;
  return `De ${formatPreco(b.valor_original)} por ${formatPreco(final)}`;
}

export default async function BeneficiosPage() {
  const supabase = await createClient();
  const [{ data: beneficios }, { data: parceiros }, { data: categorias }] = await Promise.all([
    supabase
      .from("beneficios")
      .select("*, parceiros(nome_negocio)")
      .order("created_at", { ascending: false })
      .returns<(Beneficio & { parceiros: Pick<Parceiro, "nome_negocio"> | null })[]>(),
    supabase
      .from("parceiros")
      .select("id, nome_negocio")
      .eq("status", "aprovado")
      .order("nome_negocio")
      .returns<Pick<Parceiro, "id" | "nome_negocio">[]>(),
    supabase.from("categorias").select("*").order("ordem").returns<Categoria[]>(),
  ]);

  return (
    <div>
      <h1 className="font-head text-2xl font-bold text-[#263f40]">Benefícios</h1>
      <p className="mt-1 text-sm text-[#5c6e6f]">
        Cupons à venda no clube — o cliente paga o preço do cupom e recebe o código
        de desconto para usar com o parceiro.
      </p>

      <details className="mt-6 rounded-xl border border-[#e7e2d6] bg-white open:pb-5">
        <summary className="flex cursor-pointer items-center gap-2 px-4 py-3.5 text-sm font-semibold text-[#263f40]">
          <Plus size={16} strokeWidth={2.5} />
          Adicionar benefício
        </summary>
        <form action={criarBeneficio} className="grid gap-3 px-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-xs font-medium text-[#5c6e6f]">Título</label>
            <input
              name="titulo"
              required
              placeholder="Ex: 20% off no mergulho batismo"
              className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#5c6e6f]">Parceiro</label>
            <select
              name="parceiro_id"
              required
              className="rounded-lg border border-[#e7e2d6] bg-white px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
            >
              <option value="">Selecione um parceiro</option>
              {parceiros?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome_negocio}
                </option>
              ))}
            </select>
            {!parceiros?.length && (
              <p className="text-xs text-[#b3261e]">
                Cadastre e aprove um parceiro antes de criar um benefício.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#5c6e6f]">Categoria</label>
            <select
              name="categoria_id"
              className="rounded-lg border border-[#e7e2d6] bg-white px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
            >
              <option value="">Sem categoria</option>
              {categorias?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#5c6e6f]">Tipo de desconto</label>
            <select
              name="tipo_desconto"
              className="rounded-lg border border-[#e7e2d6] bg-white px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
            >
              <option value="percentual">Percentual (%)</option>
              <option value="valor_fixo">Valor fixo (R$)</option>
              <option value="outro">Outro (descrever nas condições)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#5c6e6f]">
              Valor do desconto
            </label>
            <input
              name="valor_desconto"
              type="number"
              step="0.01"
              min="0"
              placeholder="20"
              className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#5c6e6f]">
              Valor cheio do serviço (R$)
            </label>
            <input
              name="valor_original"
              type="number"
              step="0.01"
              min="0"
              placeholder="250"
              className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
            />
            <p className="text-xs text-[#5c6e6f]">
              Preço de tabela, antes do desconto do parceiro
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#5c6e6f]">
              Preço do cupom (R$)
            </label>
            <input
              name="preco"
              type="number"
              step="0.01"
              min="0"
              defaultValue="0"
              className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
            />
            <p className="text-xs text-[#5c6e6f]">0 = cupom gratuito</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#5c6e6f]">Válido até</label>
            <input
              name="validade_fim"
              type="date"
              className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-xs font-medium text-[#5c6e6f]">Condições</label>
            <input
              name="condicoes"
              placeholder="Ex: válido de domingo a quinta, não cumulativo"
              className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUpload name="imagem_url" label="Foto do cupom" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#5c6e6f]">Quantidade disponível (opcional)</label>
            <input
              name="limite_resgates"
              type="number"
              min="1"
              placeholder="Ilimitado"
              className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#5c6e6f]">Limite por cliente (opcional)</label>
            <input
              name="limite_por_cliente"
              type="number"
              min="1"
              placeholder="Sem limite"
              className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-[#263f40] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#35494b]"
            >
              <Plus size={16} strokeWidth={2.5} />
              Salvar benefício
            </button>
          </div>
        </form>
      </details>

      <div className="mt-6 grid gap-4">
        {beneficios?.map((b) => (
          <div key={b.id} className="rounded-xl border border-[#e7e2d6] bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                {b.imagem_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={b.imagem_url}
                    alt=""
                    className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#df9c28]/12 text-[#c78716]">
                    <Ticket size={19} strokeWidth={2} />
                  </span>
                )}
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
                    {b.parceiros?.nome_negocio ?? "Sem parceiro"} · {formatDesconto(b)}
                  </p>
                  {formatValorComDesconto(b) && (
                    <p className="mt-0.5 text-sm font-medium text-[#48696c]">
                      {formatValorComDesconto(b)}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#5c6e6f]">
                    <span className="flex items-center gap-1.5">
                      <Tag size={14} strokeWidth={2} />
                      {formatPreco(b.preco)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} strokeWidth={2} />
                      {b.validade_fim
                        ? `Válido até ${new Date(b.validade_fim).toLocaleDateString("pt-BR")}`
                        : "Sem validade definida"}
                    </span>
                  </div>
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
                <form action={excluirBeneficio.bind(null, b.id)}>
                  <button
                    title="Excluir"
                    className="flex items-center gap-1.5 rounded-lg border border-[#e7e2d6] px-3 py-1.5 text-xs font-medium text-[#425c5a] hover:bg-[#f7f8f8]"
                  >
                    <Trash2 size={13} strokeWidth={2} />
                  </button>
                </form>
              </div>
            </div>
            {b.status === "ativo" && (
              <div className="mt-4 border-t border-dashed border-[#e7e2d6] pt-4">
                <GerarCupomTeste beneficioId={b.id} />
              </div>
            )}
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
