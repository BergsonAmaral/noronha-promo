"use client";

import { useState, useTransition } from "react";
import { criarCliente } from "./actions";
import { Plus, Check } from "lucide-react";

export function CriarClienteForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSucesso(false);
    startTransition(async () => {
      const { error } = await criarCliente(nome, email, senha);
      if (error) {
        setErro(error);
        return;
      }
      setNome("");
      setEmail("");
      setSenha("");
      setSucesso(true);
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 px-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#5c6e6f]">Nome</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do cliente"
          className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#5c6e6f]">E-mail de acesso</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="cliente@email.com"
          className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
        />
      </div>
      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className="text-xs font-medium text-[#5c6e6f]">Senha</label>
        <input
          type="text"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="mínimo 6 caracteres"
          className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
        />
      </div>

      {erro && <p className="text-xs text-[#b3261e] sm:col-span-2">{erro}</p>}
      {sucesso && (
        <p className="flex items-center gap-1.5 text-xs text-emerald-700 sm:col-span-2">
          <Check size={13} strokeWidth={2.5} />
          Cliente criado com sucesso.
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-[#263f40] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#35494b] disabled:opacity-60"
        >
          <Plus size={16} strokeWidth={2.5} />
          {isPending ? "Criando..." : "Salvar cliente"}
        </button>
      </div>
    </form>
  );
}
