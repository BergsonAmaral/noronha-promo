"use client";

import { formatPreco, formatDesconto, valorComDesconto } from "@/lib/format";
import { useMemo, useState, useTransition } from "react";
import { Search, Tag, ShoppingBag, Check } from "lucide-react";
import { getIcon } from "@/lib/icon-map";
import type { TipoDesconto } from "@/lib/supabase/types";
import { comprarBeneficio } from "@/lib/compra-actions";
import { CupomQrModal } from "@/components/cupom-qr-modal";

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
  valor_original: number | null;
  preco: number;
  imagemUrl: string | null;
  parceiro: string;
  categoriaId: string | null;
  categoriaNome: string;
  categoriaIcone: string;
  restantes: number | null;
  bloqueio: string | null;
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
  const [comprandoId, setComprandoId] = useState<string | null>(null);
  const [compradosIds, setCompradosIds] = useState<Set<string>>(new Set());
  const [erros, setErros] = useState<Record<string, string>>({});
  const [cupomComprado, setCupomComprado] = useState<{
    codigo: string;
    titulo: string;
    parceiro: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  function comprar(item: DescobrirItem) {
    setComprandoId(item.id);
    setErros((prev) => ({ ...prev, [item.id]: "" }));
    startTransition(async () => {
      const { error, codigo } = await comprarBeneficio(item.id);
      setComprandoId(null);
      if (error || !codigo) {
        setErros((prev) => ({ ...prev, [item.id]: error ?? "Não foi possível comprar agora." }));
        return;
      }
      setCompradosIds((prev) => new Set(prev).add(item.id));
      setCupomComprado({ codigo, titulo: item.titulo, parceiro: item.parceiro });
    });
  }

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
          const precos = valorComDesconto(item);
          const comprado = compradosIds.has(item.id);
          const erro = erros[item.id];
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              {item.imagemUrl && (
                <div
                  className="h-28 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.imagemUrl})` }}
                />
              )}
              <div className="flex gap-3 p-4">
                {!item.imagemUrl && (
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#df9c28]/12 text-[#c78716]">
                    <Icon size={19} strokeWidth={2} />
                  </span>
                )}
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
                  </div>
                  {precos && (
                    <p className="mt-1 text-xs">
                      <span className="text-[#9db1b1] line-through">
                        {formatPreco(precos.original)}
                      </span>{" "}
                      <span className="font-semibold text-[#48696c]">
                        por {formatPreco(precos.final)}
                      </span>
                    </p>
                  )}
                  <p className="mt-1 text-xs text-[#9db1b1]">
                    {formatPreco(item.preco)} <span>o cupom</span>
                  </p>

                  {item.restantes !== null && !item.bloqueio && item.restantes <= 10 && (
                    <p className="mt-1 text-xs font-medium text-[#b9770e]">
                      {item.restantes === 1 ? "Resta 1 cupom" : `Restam ${item.restantes} cupons`}
                    </p>
                  )}
                  {erro && <p className="mt-1.5 text-xs text-[#b3261e]">{erro}</p>}

                  <button
                    onClick={() => (comprado ? setCupomComprado(null) : comprar(item))}
                    disabled={(isPending && comprandoId === item.id) || (!!item.bloqueio && !comprado)}
                    className={`mt-3 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${
                      comprado
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "bg-[#263f40] text-white hover:bg-[#35494b]"
                    }`}
                  >
                    {comprado ? (
                      <>
                        <Check size={13} strokeWidth={2.5} />
                        Comprado
                      </>
                    ) : item.bloqueio ? (
                      <>{item.bloqueio}</>
                    ) : (
                      <>
                        <ShoppingBag size={13} strokeWidth={2.5} />
                        {isPending && comprandoId === item.id ? "Comprando..." : "Comprar"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {!filtrados.length && (
          <div className="rounded-2xl border border-dashed border-[#e7e2d6] bg-white p-8 text-center text-sm text-[#5c6e6f]">
            Nenhum benefício encontrado para essa busca.
          </div>
        )}
      </div>

      {cupomComprado && (
        <CupomQrModal
          codigo={cupomComprado.codigo}
          titulo={cupomComprado.titulo}
          parceiro={cupomComprado.parceiro}
          onClose={() => setCupomComprado(null)}
        />
      )}
    </div>
  );
}
