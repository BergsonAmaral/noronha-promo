import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/supabase/types";
import { Download, Users } from "lucide-react";

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Lead[]>();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-head text-2xl font-bold text-[#263f40]">Leads</h1>
          <p className="mt-1 text-sm text-[#5c6e6f]">
            Cadastros feitos no formulário &ldquo;Entre na lista do clube&rdquo; do site.
          </p>
        </div>
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(
            "nome,email,data\n" +
              (leads ?? [])
                .map((l) => `${l.nome},${l.email},${new Date(l.created_at).toLocaleDateString("pt-BR")}`)
                .join("\n")
          )}`}
          download="leads-noronha-promo.csv"
          className="flex items-center gap-2 rounded-lg border border-[#e7e2d6] px-4 py-2 text-sm font-medium text-[#425c5a] hover:bg-[#f7f8f8]"
        >
          <Download size={16} strokeWidth={2} />
          Exportar CSV
        </a>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-[#e7e2d6] bg-white">
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
    </div>
  );
}
