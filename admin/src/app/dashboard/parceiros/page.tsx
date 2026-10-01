import { createClient } from "@/lib/supabase/server";
import type { Parceiro, Categoria, ParceiroStatus } from "@/lib/supabase/types";
import { atualizarStatusParceiro } from "./actions";

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

  const { data: parceiros } = await query.returns<
    (Parceiro & { categorias: Pick<Categoria, "nome"> | null })[]
  >();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl text-[#263f40]">Parceiros</h1>
          <p className="mt-1 text-sm text-[#5c6e6f]">
            Negócios cadastrados no clube — aprove para que apareçam no site.
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

      <div className="mt-6 grid gap-4">
        {parceiros?.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-[#e7e2d6] bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[#263f40]">{p.nome_negocio}</h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[p.status]}`}
                  >
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#5c6e6f]">
                  {p.categorias?.nome ?? "Sem categoria"} ·{" "}
                  {p.email ?? "sem e-mail"} · {p.telefone ?? "sem telefone"}
                </p>
                {p.descricao && (
                  <p className="mt-2 max-w-2xl text-sm text-[#425c5a]">{p.descricao}</p>
                )}
              </div>

              <div className="flex flex-shrink-0 gap-2">
                {p.status !== "aprovado" && (
                  <form
                    action={atualizarStatusParceiro.bind(null, p.id, "aprovado")}
                  >
                    <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                      Aprovar
                    </button>
                  </form>
                )}
                {p.status !== "rejeitado" && (
                  <form
                    action={atualizarStatusParceiro.bind(null, p.id, "rejeitado")}
                  >
                    <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50">
                      Rejeitar
                    </button>
                  </form>
                )}
                {p.status === "aprovado" && (
                  <form
                    action={atualizarStatusParceiro.bind(null, p.id, "inativo")}
                  >
                    <button className="rounded-lg border border-[#e7e2d6] px-3 py-1.5 text-xs font-semibold text-[#425c5a] hover:bg-[#f7f8f8]">
                      Desativar
                    </button>
                  </form>
                )}
              </div>
            </div>
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
