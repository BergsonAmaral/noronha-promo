import type { TipoDesconto } from "@/lib/supabase/types";

export function formatMoeda(v: number) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}

export function formatPreco(v: number) {
  return v > 0 ? formatMoeda(v) : "Grátis";
}

interface Desconto {
  tipo_desconto: TipoDesconto;
  valor_desconto: number | null;
  condicoes?: string | null;
}

export function formatDesconto(d: Desconto, sufixo = "off", fallback = "Benefício especial") {
  if (!d.valor_desconto) return d.condicoes ?? fallback;
  if (d.tipo_desconto === "percentual") return `${d.valor_desconto}% ${sufixo}`;
  if (d.tipo_desconto === "valor_fixo") return `${formatMoeda(d.valor_desconto)} ${sufixo}`;
  return d.condicoes ?? fallback;
}

export function valorComDesconto(d: {
  tipo_desconto: TipoDesconto;
  valor_desconto: number | null;
  valor_original: number | null;
}) {
  if (!d.valor_original || !d.valor_desconto) return null;
  let final: number | null = null;
  if (d.tipo_desconto === "percentual") final = d.valor_original * (1 - d.valor_desconto / 100);
  else if (d.tipo_desconto === "valor_fixo") final = d.valor_original - d.valor_desconto;
  if (final == null || final < 0) return null;
  return { original: d.valor_original, final };
}

export function textoDePor(d: Parameters<typeof valorComDesconto>[0]) {
  const v = valorComDesconto(d);
  return v ? `De ${formatPreco(v.original)} por ${formatPreco(v.final)}` : null;
}
