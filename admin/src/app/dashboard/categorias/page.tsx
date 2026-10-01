import { createClient } from "@/lib/supabase/server";
import type { Categoria } from "@/lib/supabase/types";
import { criarCategoria, alternarCategoria, excluirCategoria } from "./actions";
import { getIcon } from "@/lib/icon-map";
import { Plus, Power, Trash2 } from "lucide-react";

export default async function CategoriasPage() {
  const supabase = await createClient();
  const { data: categorias } = await supabase
    .from("categorias")
    .select("*")
    .order("ordem", { ascending: true })
    .returns<Categoria[]>();

  return (
    <div>
      <h1 className="font-head text-2xl font-bold text-[#263f40]">Categorias</h1>
      <p className="mt-1 text-sm text-[#5c6e6f]">
        Categorias usadas nos benefícios e na busca do site público.
      </p>

      <form
        action={criarCategoria}
        className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-[#e7e2d6] bg-white p-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#5c6e6f]">Nome</label>
          <input
            name="nome"
            required
            placeholder="Ex: Passeios de barco"
            className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#5c6e6f]">
            Ícone (lucide)
          </label>
          <input
            name="icone"
            placeholder="compass"
            defaultValue="compass"
            className="w-40 rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-[#263f40] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#35494b]"
        >
          <Plus size={16} strokeWidth={2.5} />
          Adicionar categoria
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-[#e7e2d6] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f7f8f8] text-xs uppercase text-[#5c6e6f]">
            <tr>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7e2d6]">
            {categorias?.map((cat) => {
              const Icon = getIcon(cat.icone);
              return (
                <tr key={cat.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#df9c28]/12 text-[#c78716]">
                        <Icon size={17} strokeWidth={2} />
                      </span>
                      <span className="font-medium text-[#263f40]">{cat.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#5c6e6f]">{cat.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        cat.ativo
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-[#f7f8f8] text-[#5c6e6f]"
                      }`}
                    >
                      {cat.ativo ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <form action={alternarCategoria.bind(null, cat.id, cat.ativo)}>
                        <button
                          type="submit"
                          title={cat.ativo ? "Desativar" : "Ativar"}
                          className="flex items-center gap-1.5 rounded-lg border border-[#e7e2d6] px-3 py-1.5 text-xs font-medium text-[#425c5a] hover:bg-[#f7f8f8]"
                        >
                          <Power size={13} strokeWidth={2} />
                          {cat.ativo ? "Desativar" : "Ativar"}
                        </button>
                      </form>
                      <form action={excluirCategoria.bind(null, cat.id)}>
                        <button
                          type="submit"
                          title="Excluir"
                          className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={13} strokeWidth={2} />
                          Excluir
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!categorias?.length && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[#5c6e6f]">
                  Nenhuma categoria cadastrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
