import { createClient } from "@/lib/supabase/server";
import type { SolicitacaoParceiro } from "@/lib/supabase/types";
import { aprovarSolicitacao, rejeitarSolicitacao } from "./actions";

export default async function SolicitacoesPage() {
  const supabase = await createClient();
  const { data: solicitacoes } = await supabase
    .from("solicitacoes_parceiro")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<SolicitacaoParceiro[]>();

  return (
    <div>
      <h1 className="font-semibold text-2xl text-[#263f40]">Solicitações de parceria</h1>
      <p className="mt-1 text-sm text-[#5c6e6f]">
        Cadastros feitos no formulário &ldquo;Seja um parceiro&rdquo; do site.
      </p>

      <div className="mt-6 grid gap-4">
        {solicitacoes?.map((s) => (
          <div key={s.id} className="rounded-xl border border-[#e7e2d6] bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-[#263f40]">{s.nome_negocio}</h3>
                <p className="mt-1 text-sm text-[#5c6e6f]">
                  {s.responsavel} · {s.email} · {s.telefone ?? "sem telefone"}
                </p>
                {s.categoria_sugerida && (
                  <p className="mt-1 text-sm text-[#5c6e6f]">
                    Categoria sugerida: {s.categoria_sugerida}
                  </p>
                )}
                {s.mensagem && (
                  <p className="mt-2 max-w-2xl text-sm text-[#425c5a]">{s.mensagem}</p>
                )}
                <span className="mt-2 inline-block rounded-full bg-[#f7f8f8] px-2.5 py-0.5 text-xs font-medium text-[#5c6e6f]">
                  {s.status}
                </span>
              </div>

              {s.status === "pendente" && (
                <div className="flex flex-shrink-0 gap-2">
                  <form action={aprovarSolicitacao.bind(null, s)}>
                    <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                      Aprovar e criar parceiro
                    </button>
                  </form>
                  <form action={rejeitarSolicitacao.bind(null, s.id)}>
                    <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50">
                      Rejeitar
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        ))}

        {!solicitacoes?.length && (
          <div className="rounded-xl border border-dashed border-[#e7e2d6] bg-white p-8 text-center text-[#5c6e6f]">
            Nenhuma solicitação recebida ainda.
          </div>
        )}
      </div>
    </div>
  );
}
