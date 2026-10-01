import { createClient } from "@/lib/supabase/server";
import type { Parceiro, Categoria, ParceiroStatus } from "@/lib/supabase/types";
import { atualizarStatusParceiro, criarParceiro, excluirParceiro } from "./actions";
import { CriarAcessoParceiro } from "@/components/criar-acesso-parceiro";
import { Check, X, PauseCircle, Mail, Phone, Store, Plus, Trash2 } from "lucide-react";

const STATUS_LABEL: Record<ParceiroStatus, string> = {
  pendente: "Pendente",
  aprovado: "Aprovado",
  rejeitado: "Rejeitado",
  inativo: "Inativo",
};

const STATUS_COLOR: Record<ParceiroStatus, string> = {
  pendente: "bg-amber-50 text-amber-700",
  aprovado: "bg-emerald-50 text-emerald-700",
  rejeitado: "bg-red-50 text-red-700",
  inativo: "bg-[#f7f8f8] text-[#5c6e6f]",
};

export default async function ParceirosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("parceiros")
    .select("*, categorias(nome)")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status as ParceiroStatus);

  const [{ data: parceiros }, { data: categorias }] = await Promise.all([
    query.returns<(Parceiro & { categorias: Pick<Categoria, "nome"> | null })[]>(),
    supabase.from("categorias").select("*").order("ordem").returns<Categoria[]>(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-head text-2xl font-bold text-[#263f40]">Parceiros</h1>
          <p className="mt-1 text-sm text-[#5c6e6f]">
            Negócios cadastrados no clube — inclui pedidos feitos pelo site e os que
            você cadastrar aqui.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          {["", "pendente", "aprovado", "rejeitado", "inativo"].map((s) => (
            <a
              key={s || "todos"}
              href={s ? `/dashboard/parceiros?status=${s}` : "/dashboard/parceiros"}
              className={`rounded-lg px-3 py-1.5 font-medium ${
                status === s || (!status && !s)
                  ? "bg-[#263f40] text-white"
                  : "border border-[#e7e2d6] text-[#425c5a] hover:bg-[#f7f8f8]"
              }`}
            >
              {s ? STATUS_LABEL[s as ParceiroStatus] : "Todos"}
            </a>
          ))}
        </div>
      </div>

      <details className="mt-6 rounded-xl border border-[#e7e2d6] bg-white open:pb-5">
        <summary className="flex cursor-pointer items-center gap-2 px-4 py-3.5 text-sm font-semibold text-[#263f40]">
          <Plus size={16} strokeWidth={2.5} />
          Adicionar parceiro
        </summary>
        <form
          action={criarParceiro}
          className="grid gap-3 px-4 sm:grid-cols-2"
        >
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-xs font-medium text-[#5c6e6f]">Nome do negócio</label>
            <input
              name="nome_negocio"
              required
              placeholder="Ex: Pousada Mar Azul"
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
            <label className="text-xs font-medium text-[#5c6e6f]">Telefone</label>
            <input
              name="telefone"
              placeholder="(81) 99999-9999"
              className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#5c6e6f]">E-mail</label>
            <input
              name="email"
              type="email"
              placeholder="contato@negocio.com.br"
              className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#5c6e6f]">Descrição</label>
            <input
              name="descricao"
              placeholder="Breve descrição do negócio"
              className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-[#263f40] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#35494b]"
            >
              <Plus size={16} strokeWidth={2.5} />
              Salvar parceiro (já aprovado)
            </button>
          </div>
        </form>
      </details>

      <div className="mt-6 grid gap-4">
        {parceiros?.map((p) => (
          <div key={p.id} className="rounded-xl border border-[#e7e2d6] bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#eef4f2] text-[#48696c]">
                  <Store size={19} strokeWidth={2} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-head font-semibold text-[#263f40]">
                      {p.nome_negocio}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[p.status]}`}
                    >
                      {STATUS_LABEL[p.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#5c6e6f]">
                    {p.categorias?.nome ?? "Sem categoria"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#5c6e6f]">
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} strokeWidth={2} />
                      {p.email ?? "sem e-mail"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone size={14} strokeWidth={2} />
                      {p.telefone ?? "sem telefone"}
                    </span>
                  </div>
                  {p.descricao && (
                    <p className="mt-2 max-w-2xl text-sm text-[#425c5a]">
                      {p.descricao}
                    </p>
                  )}
                  {p.observacoes_admin && (
                    <p className="mt-2 max-w-2xl rounded-lg bg-[#f7f8f8] px-3 py-2 text-xs text-[#5c6e6f]">
                      {p.observacoes_admin}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-shrink-0 gap-2">
                {p.status !== "aprovado" && (
                  <form action={atualizarStatusParceiro.bind(null, p.id, "aprovado")}>
                    <button className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                      <Check size={14} strokeWidth={2.5} />
                      Aprovar
                    </button>
                  </form>
                )}
                {p.status !== "rejeitado" && (
                  <form action={atualizarStatusParceiro.bind(null, p.id, "rejeitado")}>
                    <button className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50">
                      <X size={14} strokeWidth={2.5} />
                      Rejeitar
                    </button>
                  </form>
                )}
                {p.status === "aprovado" && (
                  <form action={atualizarStatusParceiro.bind(null, p.id, "inativo")}>
                    <button className="flex items-center gap-1.5 rounded-lg border border-[#e7e2d6] px-3 py-1.5 text-xs font-semibold text-[#425c5a] hover:bg-[#f7f8f8]">
                      <PauseCircle size={14} strokeWidth={2} />
                      Desativar
                    </button>
                  </form>
                )}
                <form action={excluirParceiro.bind(null, p.id)}>
                  <button
                    title="Excluir"
                    className="flex items-center gap-1.5 rounded-lg border border-[#e7e2d6] px-3 py-1.5 text-xs font-semibold text-[#425c5a] hover:bg-[#f7f8f8]"
                  >
                    <Trash2 size={14} strokeWidth={2} />
                  </button>
                </form>
              </div>
            </div>

            {p.status === "aprovado" && (
              <div className="mt-4 border-t border-dashed border-[#e7e2d6] pt-4">
                {p.user_id ? (
                  <p className="text-xs text-[#5c6e6f]">
                    Este parceiro já tem login próprio.
                  </p>
                ) : (
                  <CriarAcessoParceiro parceiroId={p.id} />
                )}
              </div>
            )}
          </div>
        ))}

        {!parceiros?.length && (
          <div className="rounded-xl border border-dashed border-[#e7e2d6] bg-white p-8 text-center text-[#5c6e6f]">
            Nenhum parceiro encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
