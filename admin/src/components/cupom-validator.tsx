"use client";

import { formatDesconto } from "@/lib/format";
import { useState, useTransition } from "react";
import { QrScanner } from "@/components/qr-scanner";
import { consultarCupom, usarCupom, type CupomInfo } from "@/app/parceiro/actions";
import {
  Search,
  CheckCircle2,
  XCircle,
  Ticket,
  User,
  Clock,
  RotateCcw,
} from "lucide-react";

const STATUS_LABEL: Record<CupomInfo["status"], string> = {
  aguardando_pagamento: "Aguardando pagamento",
  pago: "Válido para uso",
  utilizado: "Já utilizado",
  expirado: "Expirado",
  cancelado: "Cancelado",
};

export function CupomValidator() {
  const [codigo, setCodigo] = useState("");
  const [cupom, setCupom] = useState<CupomInfo | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sucessoMsg, setSucessoMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function buscar(valor: string) {
    const v = valor.trim();
    if (!v) return;
    setErro(null);
    setSucessoMsg(null);
    setCupom(null);
    startTransition(async () => {
      const { data, error } = await consultarCupom(v);
      if (error) setErro(error);
      else setCupom(data);
    });
  }

  function confirmarBaixa() {
    if (!cupom) return;
    startTransition(async () => {
      const { sucesso, mensagem } = await usarCupom(codigo);
      if (sucesso) {
        setSucessoMsg(mensagem);
        setCupom({ ...cupom, status: "utilizado", utilizado_em: new Date().toISOString() });
      } else {
        setErro(mensagem);
      }
    });
  }

  function reiniciar() {
    setCodigo("");
    setCupom(null);
    setErro(null);
    setSucessoMsg(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {!cupom && !erro && (
        <>
          <QrScanner
            onScan={(valor) => {
              setCodigo(valor);
              buscar(valor);
            }}
          />

          <div className="flex items-center gap-2 text-xs text-[#9db1b1]">
            <div className="h-px flex-1 bg-[#e7e2d6]" />
            ou digite o código
            <div className="h-px flex-1 bg-[#e7e2d6]" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              buscar(codigo);
            }}
            className="flex gap-2"
          >
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              placeholder="Ex: A1B2C3D4"
              className="flex-1 rounded-lg border border-[#e7e2d6] px-3.5 py-2.5 text-sm uppercase tracking-wider text-[#263f40] outline-none focus:border-[#48696c]"
            />
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-lg bg-[#df9c28] px-4 py-2.5 text-sm font-semibold text-[#263f40] transition hover:bg-[#c78716] disabled:opacity-60"
            >
              <Search size={16} strokeWidth={2.5} />
              Buscar
            </button>
          </form>
        </>
      )}

      {erro && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <XCircle size={36} strokeWidth={1.5} className="text-red-600" />
          <p className="font-medium text-red-700">{erro}</p>
          <button
            onClick={reiniciar}
            className="mt-1 flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            <RotateCcw size={14} strokeWidth={2} />
            Tentar outro cupom
          </button>
        </div>
      )}

      {cupom && (
        <div
          className={`flex flex-col items-center gap-4 rounded-xl border p-6 text-center ${
            cupom.status === "utilizado" && sucessoMsg
              ? "border-emerald-200 bg-emerald-50"
              : cupom.status === "pago"
                ? "border-[#e7e2d6] bg-white"
                : "border-amber-200 bg-amber-50"
          }`}
        >
          {cupom.status === "utilizado" && sucessoMsg ? (
            <CheckCircle2 size={40} strokeWidth={1.5} className="text-emerald-600" />
          ) : (
            <Ticket size={32} strokeWidth={1.5} className="text-[#c78716]" />
          )}

          <div>
            <h3 className="font-head text-lg font-bold text-[#263f40]">
              {cupom.beneficio_titulo}
            </h3>
            {formatDesconto(cupom, "de desconto", "") && (
              <p className="text-sm text-[#5c6e6f]">{formatDesconto(cupom, "de desconto", "")}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5 text-sm text-[#425c5a]">
            <span className="flex items-center justify-center gap-1.5">
              <User size={14} strokeWidth={2} />
              {cupom.cliente_nome}
            </span>
            <span className="flex items-center justify-center gap-1.5">
              <Clock size={14} strokeWidth={2} />
              Gerado em {new Date(cupom.resgatado_em).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              cupom.status === "pago"
                ? "bg-emerald-100 text-emerald-700"
                : cupom.status === "utilizado"
                  ? "bg-[#f7f8f8] text-[#5c6e6f]"
                  : "bg-amber-100 text-amber-700"
            }`}
          >
            {STATUS_LABEL[cupom.status]}
          </span>

          {sucessoMsg && <p className="text-sm font-medium text-emerald-700">{sucessoMsg}</p>}

          <div className="mt-2 flex gap-2">
            {cupom.status === "pago" && !sucessoMsg && (
              <button
                onClick={confirmarBaixa}
                disabled={isPending}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                <CheckCircle2 size={18} strokeWidth={2} />
                Confirmar uso do cupom
              </button>
            )}
            <button
              onClick={reiniciar}
              className="flex items-center gap-2 rounded-lg border border-[#e7e2d6] px-4 py-3 text-sm font-medium text-[#425c5a] hover:bg-[#f7f8f8]"
            >
              <RotateCcw size={14} strokeWidth={2} />
              {cupom.status === "pago" && !sucessoMsg ? "Cancelar" : "Validar outro cupom"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
