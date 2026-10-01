"use client";

import { useState } from "react";
import { CupomQrModal } from "./cupom-qr-modal";
import { CheckCircle2, Tag, QrCode } from "lucide-react";
import type { TipoDesconto } from "@/lib/supabase/types";

export interface CupomCardData {
  codigo: string;
  titulo: string;
  parceiro: string;
  condicoes: string | null;
  tipo_desconto: TipoDesconto;
  valor_desconto: number | null;
  utilizado: boolean;
  utilizadoEm: string | null;
}

function formatDesconto(c: CupomCardData) {
  if (!c.valor_desconto) return c.condicoes ?? "Benefício especial";
  if (c.tipo_desconto === "percentual") return `${c.valor_desconto}% de desconto`;
  if (c.tipo_desconto === "valor_fixo")
    return `R$ ${c.valor_desconto.toFixed(2).replace(".", ",")} de desconto`;
  return c.condicoes ?? "Benefício especial";
}

export function CupomCard({ cupom }: { cupom: CupomCardData }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl bg-white shadow-sm ${
          cupom.utilizado ? "opacity-60" : ""
        }`}
      >
        <div className="p-5 pb-4">
          <p className="text-xs font-semibold tracking-wide text-[#c78716] uppercase">
            {cupom.parceiro}
          </p>
          <h3 className="mt-1 font-head text-lg leading-snug font-bold text-[#263f40]">
            {cupom.titulo}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#48696c]">
            <Tag size={14} strokeWidth={2.5} />
            {formatDesconto(cupom)}
          </p>
        </div>

        {/* perfuração do ticket */}
        <div className="relative h-0 border-t-2 border-dashed border-[#e7e2d6]">
          <span className="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full bg-[#f7f8f8]" />
          <span className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full bg-[#f7f8f8]" />
        </div>

        <div className="flex items-center justify-between p-5 pt-4">
          <span className="font-mono text-sm font-semibold tracking-widest text-[#9db1b1]">
            {cupom.codigo}
          </span>
          {cupom.utilizado ? (
            <span className="flex items-center gap-1.5 text-sm font-medium text-[#5c6e6f]">
              <CheckCircle2 size={16} strokeWidth={2} />
              Usado
            </span>
          ) : (
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-[#263f40] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#35494b]"
            >
              <QrCode size={15} strokeWidth={2.5} />
              Mostrar
            </button>
          )}
        </div>
      </div>

      {open && (
        <CupomQrModal
          codigo={cupom.codigo}
          titulo={cupom.titulo}
          parceiro={cupom.parceiro}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
