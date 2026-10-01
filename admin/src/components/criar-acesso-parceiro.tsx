"use client";

import { useState, useTransition } from "react";
import { criarAcessoParceiro } from "@/app/dashboard/parceiros/actions";
import { KeyRound, Check } from "lucide-react";

export function CriarAcessoParceiro({ parceiroId }: { parceiroId: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (sucesso) {
    return (
      <span className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
        <Check size={13} strokeWidth={2.5} />
        Acesso criado
      </span>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-[#e7e2d6] px-3 py-1.5 text-xs font-semibold text-[#425c5a] hover:bg-[#f7f8f8]"
      >
        <KeyRound size={13} strokeWidth={2} />
        Criar acesso
      </button>
    );
  }

  function enviar() {
    setErro(null);
    startTransition(async () => {
      const { error } = await criarAcessoParceiro(parceiroId, email, senha);
      if (error) {
        setErro(error);
        return;
      }
      setSucesso(true);
    });
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[#e7e2d6] bg-[#f7f8f8] p-3">
      <p className="text-xs font-semibold text-[#263f40]">Criar login do parceiro</p>
      <input
        type="email"
        placeholder="e-mail de acesso"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-lg border border-[#e7e2d6] px-3 py-1.5 text-xs text-[#263f40] outline-none focus:border-[#48696c]"
      />
      <input
        type="text"
        placeholder="senha (mín. 6 caracteres)"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className="rounded-lg border border-[#e7e2d6] px-3 py-1.5 text-xs text-[#263f40] outline-none focus:border-[#48696c]"
      />
      {erro && <p className="text-xs text-[#b3261e]">{erro}</p>}
      <div className="flex gap-2">
        <button
          onClick={enviar}
          disabled={isPending}
          className="flex-1 rounded-lg bg-[#263f40] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#35494b] disabled:opacity-60"
        >
          {isPending ? "Criando..." : "Confirmar"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-lg border border-[#e7e2d6] px-3 py-1.5 text-xs font-medium text-[#425c5a] hover:bg-white"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
