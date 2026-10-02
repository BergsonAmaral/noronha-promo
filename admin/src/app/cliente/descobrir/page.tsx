import { createClient } from "@/lib/supabase/server";
import type { Beneficio, Categoria, Parceiro } from "@/lib/supabase/types";
import { DescobrirList, type CategoriaChip, type DescobrirItem } from "@/components/descobrir-list";

type BeneficioComDetalhes = Beneficio & {
  categorias: Pick<Categoria, "nome" | "icone"> | null;
  parceiros: Pick<Parceiro, "nome_negocio"> | null;
};

export default async function DescobrirPage() {
  const supabase = await createClient();

  const [{ data: beneficios }, { data: categorias }, { data: contagens }] = await Promise.all([
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
    supabase.rpc("contagem_resgates"),
  ]);

  const contagem = new Map(
    ((contagens ?? []) as { beneficio_id: string; vendidos: number; meus: number }[]).map((c) => [
      c.beneficio_id,
      c,
    ])
  );

  const itens: DescobrirItem[] = (beneficios ?? [])
    .filter((b) => !b.validade_fim || b.validade_fim >= new Date().toISOString().slice(0, 10))
    .map((b) => {
    const c = contagem.get(b.id);
    const vendidos = Number(c?.vendidos ?? 0);
    const meus = Number(c?.meus ?? 0);
    const restantes = b.limite_resgates != null ? Math.max(b.limite_resgates - vendidos, 0) : null;
    const bloqueio =
      restantes === 0
        ? "Esgotado"
        : b.limite_por_cliente != null && meus >= b.limite_por_cliente
          ? "Limite atingido"
          : null;
    return {
    id: b.id,
    titulo: b.titulo,
    condicoes: b.condicoes,
    tipo_desconto: b.tipo_desconto,
    valor_desconto: b.valor_desconto,
    valor_original: b.valor_original,
    preco: b.preco,
    imagemUrl: b.imagem_url,
    parceiro: b.parceiros?.nome_negocio ?? "Noronha Promo",
    categoriaId: b.categoria_id,
    categoriaNome: b.categorias?.nome ?? "Geral",
    categoriaIcone: b.categorias?.icone ?? "compass",
    restantes,
    bloqueio,
    };
  });

  return (
    <div>
      <h1 className="font-head text-xl font-bold text-[#263f40]">Descobrir</h1>
      <p className="mt-1 mb-5 text-sm text-[#5c6e6f]">
        Passeios, hospedagens e experiências com desconto do clube.
      </p>
      <p className="mb-4 rounded-lg bg-[#df9c28]/10 px-3 py-2 text-xs text-[#8a5f0f]">
        Modo de teste: o botão Comprar libera o cupom na hora, sem cobrança.
      </p>
      <DescobrirList categorias={categorias ?? []} itens={itens} />
    </div>
  );
}
