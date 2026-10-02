import { ImageUpload } from "@/components/image-upload";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Beneficio, Categoria, Parceiro, Resgate } from "@/lib/supabase/types";
import { criarBeneficio, atualizarStatusBeneficio, excluirBeneficio } from "./actions";
import { Ticket, Tag, TrendingUp, ShoppingBag, Play, Pause, Trash2, Plus } from "lucide-react";

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

  const [{ data: beneficios }, { data: categorias }] = await Promise.all([
    supabase
      .from("beneficios")
      .select("*, resgates(status, valor_pago)")
      .eq("parceiro_id", parceiro.id)
      .order("created_at", { ascending: false })
      .returns<BeneficioComResgates[]>(),
    supabase.from("categorias").select("*").order("ordem").returns<Categoria[]>(),
  ]);

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
        Cupons anunciados em nome do seu negócio. Assim que você cadastrar, já fica
        ativo no site e no portal.
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

      <details className="mt-5 rounded-2xl border border-[#e7e2d6] bg-white open:pb-5">
        <summary className="flex cursor-pointer items-center gap-2 px-4 py-3.5 text-sm font-semibold text-[#263f40]">
          <Plus size={16} strokeWidth={2.5} />
          Cadastrar novo benefício
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
            <label className="text-xs font-medium text-[#5c6e6f]">Valor do desconto</label>
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
            <p className="text-xs text-[#5c6e6f]">Preço de tabela, antes do desconto</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#5c6e6f]">Preço do cupom (R$)</label>
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

      <div className="mt-5 flex flex-col gap-3">
        {beneficios?.map((b) => (
          <div key={b.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {b.imagem_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={b.imagem_url}
                    alt=""
                    className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#df9c28]/12 text-[#c78716]">
                    <Ticket size={17} strokeWidth={2} />
                  </span>
                )}
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

              <div className="flex flex-shrink-0 gap-1.5">
                {b.status !== "ativo" && (
                  <form action={atualizarStatusBeneficio.bind(null, b.id, "ativo")}>
                    <button
                      title="Ativar"
                      className="flex items-center gap-1 rounded-lg border border-[#e7e2d6] px-2.5 py-1.5 text-xs font-medium text-[#425c5a] hover:bg-[#f7f8f8]"
                    >
                      <Play size={12} strokeWidth={2} />
                    </button>
                  </form>
                )}
                {b.status !== "pausado" && (
                  <form action={atualizarStatusBeneficio.bind(null, b.id, "pausado")}>
                    <button
                      title="Pausar"
                      className="flex items-center gap-1 rounded-lg border border-[#e7e2d6] px-2.5 py-1.5 text-xs font-medium text-[#425c5a] hover:bg-[#f7f8f8]"
                    >
                      <Pause size={12} strokeWidth={2} />
                    </button>
                  </form>
                )}
                <form action={excluirBeneficio.bind(null, b.id)}>
                  <button
                    title="Excluir"
                    className="flex items-center gap-1 rounded-lg border border-[#e7e2d6] px-2.5 py-1.5 text-xs font-medium text-[#425c5a] hover:bg-[#f7f8f8]"
                  >
                    <Trash2 size={12} strokeWidth={2} />
                  </button>
                </form>
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
