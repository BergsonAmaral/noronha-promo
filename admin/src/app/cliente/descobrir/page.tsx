import { createClient } from "@/lib/supabase/server";
import type { Beneficio, Categoria, Parceiro } from "@/lib/supabase/types";
import { DescobrirList, type CategoriaChip, type DescobrirItem } from "@/components/descobrir-list";

type BeneficioComDetalhes = Beneficio & {
  categorias: Pick<Categoria, "nome" | "icone"> | null;
  parceiros: Pick<Parceiro, "nome_negocio"> | null;
};

export default async function DescobrirPage() {
  const supabase = await createClient();

  const [{ data: beneficios }, { data: categorias }] = await Promise.all([
    supabase
      .from("beneficios")
      .select("*, categorias(nome, icone), parceiros(nome_negocio)")
      .eq("status", "ativo")
      .order("created_at", { ascending: false })
      .returns<BeneficioComDetalhes[]>(),
    supabase
      .from("categorias")
      .select("id, nome, icone")
      .eq("ativo", true)
      .order("ordem")
      .returns<CategoriaChip[]>(),
  ]);

  const itens: DescobrirItem[] = (beneficios ?? []).map((b) => ({
    id: b.id,
    titulo: b.titulo,
    condicoes: b.condicoes,
    tipo_desconto: b.tipo_desconto,
    valor_desconto: b.valor_desconto,
    preco: b.preco,
    parceiro: b.parceiros?.nome_negocio ?? "Noronha Promo",
    categoriaId: b.categoria_id,
    categoriaNome: b.categorias?.nome ?? "Geral",
    categoriaIcone: b.categorias?.icone ?? "compass",
  }));

  return (
    <div>
      <h1 className="font-head text-xl font-bold text-[#263f40]">Descobrir</h1>
      <p className="mt-1 mb-5 text-sm text-[#5c6e6f]">
        Passeios, hospedagens e experiências com desconto do clube.
      </p>
      <DescobrirList categorias={categorias ?? []} itens={itens} />
    </div>
  );
}
