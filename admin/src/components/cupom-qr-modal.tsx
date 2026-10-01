"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export function CupomQrModal({
  codigo,
  titulo,
  parceiro,
  onClose,
}: {
  codigo: string;
  titulo: string;
  parceiro: string;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const QRCode = (await import("qrcode")).default;
      if (cancelled || !canvasRef.current) return;
      await QRCode.toCanvas(canvasRef.current, codigo, {
        width: 240,
        margin: 1,
        color: { dark: "#263f40", light: "#ffffff" },
      });
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [codigo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#263f40]/80 p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-[#9db1b1] hover:bg-[#f7f8f8] hover:text-[#5c6e6f]"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <p className="text-xs font-medium tracking-wide text-[#9db1b1] uppercase">
          {parceiro}
        </p>
        <h2 className="mt-1 font-head text-lg font-bold text-[#263f40]">{titulo}</h2>

        <div className="mt-5 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className={ready ? "opacity-100" : "opacity-0"}
            style={{ transition: "opacity 150ms" }}
          />
        </div>

        <p className="mt-5 font-mono text-xl font-bold tracking-[0.3em] text-[#263f40]">
          {codigo}
        </p>
        <p className="mt-3 text-xs text-[#5c6e6f]">
          Mostre esta tela para o parceiro escanear ou digitar o código.
        </p>
      </div>
    </div>
  );
}
