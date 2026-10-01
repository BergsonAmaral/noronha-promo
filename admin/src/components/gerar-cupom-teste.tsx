"use client";

import { useRef, useState, useTransition } from "react";
import { gerarCupomTeste } from "@/app/dashboard/beneficios/actions";
import { QrCode, X } from "lucide-react";

export function GerarCupomTeste({ beneficioId }: { beneficioId: string }) {
  const [codigo, setCodigo] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function gerar() {
    setErro(null);
    startTransition(async () => {
      const { codigo: novoCodigo, error } = await gerarCupomTeste(beneficioId);
      if (error) {
        setErro(error);
        return;
      }
      setCodigo(novoCodigo);
      if (novoCodigo && canvasRef.current) {
        const QRCode = (await import("qrcode")).default;
        await QRCode.toCanvas(canvasRef.current, novoCodigo, { width: 180, margin: 1 });
      }
    });
  }

  if (codigo) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-[#e7e2d6] bg-[#f7f8f8] p-4">
        <button
          onClick={() => setCodigo(null)}
          className="self-end text-[#9db1b1] hover:text-[#5c6e6f]"
        >
          <X size={14} strokeWidth={2} />
        </button>
        <canvas ref={canvasRef} />
        <p className="font-mono text-sm font-semibold tracking-widest text-[#263f40]">
          {codigo}
        </p>
        <p className="text-center text-xs text-[#5c6e6f]">
          Cupom de teste — escaneie no portal do parceiro para validar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={gerar}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-lg border border-[#e7e2d6] px-3 py-1.5 text-xs font-medium text-[#425c5a] hover:bg-[#f7f8f8] disabled:opacity-60"
      >
        <QrCode size={13} strokeWidth={2} />
        Gerar cupom de teste
      </button>
      {erro && <p className="text-xs text-[#b3261e]">{erro}</p>}
    </div>
  );
}
