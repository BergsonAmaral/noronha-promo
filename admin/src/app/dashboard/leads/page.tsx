import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Lead, Parceiro, Categoria } from "@/lib/supabase/types";
import { Download, Users, Store, Mail, Phone, Check, X } from "lucide-react";
import { atualizarStatusParceiro } from "../parceiros/actions";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const abaAtiva = tab === "parceria" ? "parceria" : "newsletter";

  const supabase = await createClient();
  const [{ data: leads }, { data: pedidos }] = await Promise.all([
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<Lead[]>(),
    supabase
      .from("parceiros")
      .select("*, categorias(nome)")
      .eq("status", "pendente")
      .order("created_at", { ascending: false })
      .returns<(Parceiro & { categorias: Pick<Categoria, "nome"> | null })[]>(),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-head text-2xl font-bold text-[#263f40]">Leads</h1>
          <p className="mt-1 text-sm text-[#5c6e6f]">
            Pessoas e negócios interessados no clube, antes de virarem conta.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <Link
            href="/dashboard/leads?tab=newsletter"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium ${
              abaAtiva === "newsletter"
                ? "bg-[#263f40] text-white"
                : "border border-[#e7e2d6] text-[#425c5a] hover:bg-[#f7f8f8]"
            }`}
          >
            <Users size={14} strokeWidth={2} />
            Newsletter
            <span
              className={`rounded-full px-1.5 text-xs ${
                abaAtiva === "newsletter" ? "bg-white/15" : "bg-[#f7f8f8]"
              }`}
            >
              {leads?.length ?? 0}
            </span>
          </Link>
          <Link
            href="/dashboard/leads?tab=parceria"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium ${
              abaAtiva === "parceria"
                ? "bg-[#263f40] text-white"
                : "border border-[#e7e2d6] text-[#425c5a] hover:bg-[#f7f8f8]"
            }`}
          >
            <Store size={14} strokeWidth={2} />
            Pedidos de parceria
            <span
              className={`rounded-full px-1.5 text-xs ${
                abaAtiva === "parceria" ? "bg-white/15" : "bg-[#f7f8f8]"
              }`}
            >
              {pedidos?.length ?? 0}
            </span>
          </Link>
        </div>
      </div>

      {abaAtiva === "newsletter" ? (
        <>
          <div className="mt-6 flex justify-end">
            <a
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(
                "nome,email,data\n" +
                  (leads ?? [])
                    .map(
                      (l) =>
                        `${l.nome},${l.email},${new Date(l.created_at).toLocaleDateString("pt-BR")}`
                    )
                    .join("\n")
              )}`}
              download="leads-noronha-promo.csv"
              className="flex items-center gap-2 rounded-lg border border-[#e7e2d6] px-4 py-2 text-sm font-medium text-[#425c5a] hover:bg-[#f7f8f8]"
            >
              <Download size={16} strokeWidth={2} />
              Exportar CSV
            </a>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-[#e7e2d6] bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f7f8f8] text-xs uppercase text-[#5c6e6f]">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Cadastrado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e2d6]">
                {leads?.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5 font-medium text-[#263f40]">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef4f2] text-[#48696c]">
                          <Users size={13} strokeWidth={2} />
                        </span>
                        {lead.nome}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#5c6e6f]">{lead.email}</td>
                    <td className="px-4 py-3 text-[#5c6e6f]">
                      {new Date(lead.created_at).toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
                {!leads?.length && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-[#5c6e6f]">
                      Nenhum lead cadastrado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="mt-6 grid gap-4">
          <p className="text-sm text-[#5c6e6f]">
            Pedidos feitos pelo formulário &ldquo;Seja um parceiro&rdquo; do site, aguardando
            aprovação. Depois de aprovar, gerencie o acesso em{" "}
            <Link href="/dashboard/parceiros" className="underline">
              Parceiros
            </Link>
            .
          </p>

          {pedidos?.map((p) => (
            <div key={p.id} className="rounded-xl border border-[#e7e2d6] bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#eef4f2] text-[#48696c]">
                    <Store size={19} strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="font-head font-semibold text-[#263f40]">
                      {p.nome_negocio}
                    </h3>
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
                      <p className="mt-2 max-w-2xl text-sm text-[#425c5a]">{p.descricao}</p>
                    )}
                    <p className="mt-2 text-xs text-[#9db1b1]">
                      Recebido em {new Date(p.created_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-shrink-0 gap-2">
                  <form action={atualizarStatusParceiro.bind(null, p.id, "aprovado")}>
                    <button className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                      <Check size={14} strokeWidth={2.5} />
                      Aprovar
                    </button>
                  </form>
                  <form action={atualizarStatusParceiro.bind(null, p.id, "rejeitado")}>
                    <button className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50">
                      <X size={14} strokeWidth={2.5} />
                      Rejeitar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}

          {!pedidos?.length && (
            <div className="rounded-xl border border-dashed border-[#e7e2d6] bg-white p-8 text-center text-[#5c6e6f]">
              Nenhum pedido de parceria pendente.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
