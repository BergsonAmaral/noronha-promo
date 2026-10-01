"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff } from "lucide-react";

export function QrScanner({ onScan }: { onScan: (codigo: string) => void }) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const lastScanRef = useRef<{ code: string; at: number }>({ code: "", at: 0 });

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    (async () => {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelled || !containerRef.current) return;

      const scanner = new Html5Qrcode(containerRef.current.id);
      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            const now = Date.now();
            // evita disparar várias vezes seguidas pro mesmo código
            if (decodedText === lastScanRef.current.code && now - lastScanRef.current.at < 3000) {
              return;
            }
            lastScanRef.current = { code: decodedText, at: now };
            onScan(decodedText);
          },
          () => {
            // erro de frame individual (sem QR visível) — ignora, é normal
          }
        );
      } catch {
        if (!cancelled) {
          setError("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
          setActive(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      scannerRef.current
        ?.stop()
        .then(() => scannerRef.current?.clear())
        .catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className="flex flex-col items-center gap-3">
      {active ? (
        <>
          <div
            id="qr-reader"
            ref={containerRef}
            className="w-full max-w-xs overflow-hidden rounded-xl border border-[#e7e2d6] bg-black"
          />
          <button
            type="button"
            onClick={() => setActive(false)}
            className="flex items-center gap-2 rounded-lg border border-[#e7e2d6] px-4 py-2 text-sm font-medium text-[#425c5a] hover:bg-[#f7f8f8]"
          >
            <CameraOff size={16} strokeWidth={2} />
            Parar câmera
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => {
            setError(null);
            setActive(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-[#263f40] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#35494b]"
        >
          <Camera size={18} strokeWidth={2} />
          Escanear QR Code
        </button>
      )}
      {error && <p className="text-sm text-[#b3261e]">{error}</p>}
    </div>
  );
}
