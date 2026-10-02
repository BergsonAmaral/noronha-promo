"use client";

import { useState, useTransition } from "react";
import { alterarSenha } from "@/lib/conta-actions";
import { KeyRound, Check } from "lucide-react";

export function AlterarSenhaForm() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSucesso(false);
    startTransition(async () => {
      const { error } = await alterarSenha(novaSenha, confirmarSenha);
      if (error) {
        setErro(error);
        return;
      }
      setNovaSenha("");
      setConfirmarSenha("");
      setSucesso(true);
    });
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 font-head text-lg font-bold text-[#263f40]">
        <KeyRound size={18} strokeWidth={2} />
        Alterar senha
      </h2>
      <p className="mt-1 mb-4 text-sm text-[#5c6e6f]">
        Defina uma nova senha de acesso ao portal.
      </p>

      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#5c6e6f]">Nova senha</label>
          <input
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            placeholder="mínimo 6 caracteres"
            className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#5c6e6f]">Confirmar nova senha</label>
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="repita a senha"
            className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
          />
        </div>

        {erro && <p className="text-xs text-[#b3261e] sm:col-span-2">{erro}</p>}
        {sucesso && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-700 sm:col-span-2">
            <Check size={13} strokeWidth={2.5} />
            Senha alterada com sucesso.
          </p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-[#263f40] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#35494b] disabled:opacity-60"
          >
            {isPending ? "Salvando..." : "Salvar nova senha"}
          </button>
        </div>
      </form>
    </div>
  );
}
