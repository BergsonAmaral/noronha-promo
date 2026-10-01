import { createClient } from "@/lib/supabase/server";
import type { Categoria } from "@/lib/supabase/types";
import { criarCategoria, alternarCategoria, excluirCategoria } from "./actions";

export default async function CategoriasPage() {
  const supabase = await createClient();
  const { data: categorias } = await supabase
    .from("categorias")
    .select("*")
    .order("ordem", { ascending: true })
    .returns<Categoria[]>();

  return (
    <div>
      <h1 className="font-semibold text-2xl text-[#263f40]">Categorias</h1>
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
            className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm outline-none focus:border-[#48696c]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#5c6e6f]">
            Ícone (nome lucide)
          </label>
          <input
            name="icone"
            placeholder="compass"
            defaultValue="compass"
            className="w-40 rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm outline-none focus:border-[#48696c]"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-[#263f40] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#35494b]"
        >
          Adicionar categoria
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-[#e7e2d6] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f7f8f8] text-xs uppercase text-[#5c6e6f]">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Ícone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7e2d6]">
            {categorias?.map((cat) => (
              <tr key={cat.id}>
                <td className="px-4 py-3 font-medium text-[#263f40]">{cat.nome}</td>
                <td className="px-4 py-3 text-[#5c6e6f]">{cat.slug}</td>
                <td className="px-4 py-3 text-[#5c6e6f]">{cat.icone}</td>
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
                    <form
                      action={alternarCategoria.bind(null, cat.id, cat.ativo)}
                    >
                      <button
                        type="submit"
                        className="rounded-lg border border-[#e7e2d6] px-3 py-1.5 text-xs font-medium text-[#425c5a] hover:bg-[#f7f8f8]"
                      >
                        {cat.ativo ? "Desativar" : "Ativar"}
                      </button>
                    </form>
                    <form action={excluirCategoria.bind(null, cat.id)}>
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                      >
                        Excluir
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {!categorias?.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#5c6e6f]">
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
