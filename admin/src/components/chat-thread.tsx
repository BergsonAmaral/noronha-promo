"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  listarMensagens,
  enviarMensagem,
  marcarComoLida,
  type ThreadFiltro,
} from "@/lib/mensagens-actions";
import type { Mensagem, UserRole } from "@/lib/supabase/types";
import { Send } from "lucide-react";

function formatHora(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatThread({
  filtro,
  meRole,
  counterpartLabel,
  initialMensagens,
}: {
  filtro: ThreadFiltro;
  meRole: UserRole;
  counterpartLabel: string;
  initialMensagens: Mensagem[];
}) {
  const [mensagens, setMensagens] = useState(initialMensagens);
  const [texto, setTexto] = useState("");
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const filtroKey = "parceiro_id" in filtro ? filtro.parceiro_id : filtro.cliente_id;

  useEffect(() => {
    marcarComoLida(filtro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroKey]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const atual = await listarMensagens(filtro);
      setMensagens(atual);
    }, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens.length]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const texto2 = texto.trim();
    if (!texto2) return;
    setTexto("");
    startTransition(async () => {
      await enviarMensagem(filtro, texto2);
      const atual = await listarMensagens(filtro);
      setMensagens(atual);
    });
  }

  return (
    <div className="flex h-[calc(100vh-13rem)] flex-col rounded-2xl bg-white shadow-sm">
      <div className="border-b border-[#e7e2d6] px-5 py-3.5">
        <p className="font-head text-sm font-semibold text-[#263f40]">{counterpartLabel}</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {mensagens.map((m) => {
          const minha = m.remetente_role === meRole;
          return (
            <div key={m.id} className={`flex ${minha ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  minha
                    ? "rounded-br-sm bg-[#263f40] text-white"
                    : "rounded-bl-sm bg-[#f7f8f8] text-[#263f40]"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.mensagem}</p>
                <p
                  className={`mt-1 text-[10px] ${minha ? "text-[#9db1b1]" : "text-[#9db1b1]"}`}
                >
                  {formatHora(m.created_at)}
                </p>
              </div>
            </div>
          );
        })}

        {!mensagens.length && (
          <p className="pt-8 text-center text-sm text-[#9db1b1]">
            Nenhuma mensagem ainda. Diga olá!
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={onSubmit} className="flex gap-2 border-t border-[#e7e2d6] p-3">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva uma mensagem..."
          className="flex-1 rounded-full border border-[#e7e2d6] px-4 py-2.5 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
        />
        <button
          type="submit"
          disabled={isPending || !texto.trim()}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#263f40] text-white transition hover:bg-[#35494b] disabled:opacity-50"
        >
          <Send size={16} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}
