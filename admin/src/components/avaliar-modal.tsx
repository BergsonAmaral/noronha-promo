"use client";

import { useState, useTransition } from "react";
import { criarAvaliacao } from "@/lib/avaliacoes-actions";
import { Star, X } from "lucide-react";

export function AvaliarModal({
  resgateId,
  parceiroId,
  titulo,
  parceiro,
  onClose,
  onEnviado,
}: {
  resgateId: string;
  parceiroId: string;
  titulo: string;
  parceiro: string;
  onClose: () => void;
  onEnviado: () => void;
}) {
  const [nota, setNota] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function enviar() {
    if (!nota) {
      setErro("Escolha de 1 a 5 estrelas.");
      return;
    }
    setErro(null);
    startTransition(async () => {
      const { error } = await criarAvaliacao(resgateId, parceiroId, nota, comentario);
      if (error) {
        setErro(error);
        return;
      }
      onEnviado();
    });
  }

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
        <h2 className="mt-1 font-head text-lg font-bold text-[#263f40]">
          Como foi {titulo}?
        </h2>

        <div className="mt-4 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setNota(n)}
              className="p-0.5"
            >
              <Star
                size={30}
                strokeWidth={1.5}
                className={
                  (hover || nota) >= n
                    ? "fill-[#df9c28] text-[#df9c28]"
                    : "fill-transparent text-[#e7e2d6]"
                }
              />
            </button>
          ))}
        </div>

        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={3}
          placeholder="Conte como foi a experiência (opcional)"
          className="mt-4 w-full resize-none rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
        />

        {erro && <p className="mt-2 text-xs text-[#b3261e]">{erro}</p>}

        <button
          onClick={enviar}
          disabled={isPending}
          className="mt-4 w-full rounded-full bg-[#263f40] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#35494b] disabled:opacity-60"
        >
          {isPending ? "Enviando..." : "Enviar avaliação"}
        </button>
      </div>
    </div>
  );
}
