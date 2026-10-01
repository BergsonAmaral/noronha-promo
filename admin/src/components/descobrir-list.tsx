"use client";

import { useMemo, useState } from "react";
import { Search, Tag, Clock } from "lucide-react";
import { getIcon } from "@/lib/icon-map";
import type { TipoDesconto } from "@/lib/supabase/types";

export interface CategoriaChip {
  id: string;
  nome: string;
  icone: string;
}

export interface DescobrirItem {
  id: string;
  titulo: string;
  condicoes: string | null;
  tipo_desconto: TipoDesconto;
  valor_desconto: number | null;
  preco: number;
  parceiro: string;
  categoriaId: string | null;
  categoriaNome: string;
  categoriaIcone: string;
}

function formatDesconto(item: DescobrirItem) {
  if (!item.valor_desconto) return item.condicoes ?? "Benefício especial";
  if (item.tipo_desconto === "percentual") return `${item.valor_desconto}% off`;
  if (item.tipo_desconto === "valor_fixo")
    return `R$ ${item.valor_desconto.toFixed(2).replace(".", ",")} off`;
  return item.condicoes ?? "Benefício especial";
}

function formatPreco(preco: number) {
  return preco > 0 ? `R$ ${preco.toFixed(2).replace(".", ",")}` : "Grátis";
}

export function DescobrirList({
  categorias,
  itens,
}: {
  categorias: CategoriaChip[];
  itens: DescobrirItem[];
}) {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return itens.filter((item) => {
      if (categoriaAtiva && item.categoriaId !== categoriaAtiva) return false;
      if (!termo) return true;
      return (
        item.titulo.toLowerCase().includes(termo) ||
        item.parceiro.toLowerCase().includes(termo) ||
        item.categoriaNome.toLowerCase().includes(termo)
      );
    });
  }, [itens, busca, categoriaAtiva]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search
          size={16}
          strokeWidth={2}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#9db1b1]"
        />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar passeio, parceiro, categoria..."
          className="w-full rounded-full border border-[#e7e2d6] bg-white py-2.5 pr-4 pl-10 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
        />
      </div>

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setCategoriaAtiva(null)}
          className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition ${
            categoriaAtiva === null
              ? "border-[#263f40] bg-[#263f40] text-white"
              : "border-[#e7e2d6] bg-white text-[#5c6e6f]"
          }`}
        >
          Tudo
        </button>
        {categorias.map((c) => {
          const Icon = getIcon(c.icone);
          const active = categoriaAtiva === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCategoriaAtiva(active ? null : c.id)}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                active
                  ? "border-[#263f40] bg-[#263f40] text-white"
                  : "border-[#e7e2d6] bg-white text-[#5c6e6f]"
              }`}
            >
              <Icon size={13} strokeWidth={2} />
              {c.nome}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {filtrados.map((item) => {
          const Icon = getIcon(item.categoriaIcone);
          return (
            <div
              key={item.id}
              className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#df9c28]/12 text-[#c78716]">
                <Icon size={19} strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold tracking-wide text-[#9db1b1] uppercase">
                  {item.parceiro}
                </p>
                <h3 className="mt-0.5 font-head text-sm leading-snug font-bold text-[#263f40]">
                  {item.titulo}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5c6e6f]">
                  <span className="flex items-center gap-1 font-medium text-[#48696c]">
                    <Tag size={12} strokeWidth={2.5} />
                    {formatDesconto(item)}
                  </span>
                  <span>{formatPreco(item.preco)}</span>
                </div>
              </div>
              <button
                disabled
                title="A compra pelo site chega em breve"
                className="flex h-fit flex-shrink-0 items-center gap-1 rounded-full border border-[#e7e2d6] px-3 py-1.5 text-xs font-medium text-[#9db1b1]"
              >
                <Clock size={12} strokeWidth={2} />
                Em breve
              </button>
            </div>
          );
        })}

        {!filtrados.length && (
          <div className="rounded-2xl border border-dashed border-[#e7e2d6] bg-white p-8 text-center text-sm text-[#5c6e6f]">
            Nenhum benefício encontrado para essa busca.
          </div>
        )}
      </div>
    </div>
  );
}
