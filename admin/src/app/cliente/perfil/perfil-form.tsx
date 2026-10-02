"use client";

import { useState, useTransition } from "react";
import { atualizarPerfilCliente } from "./actions";
import type { Profile } from "@/lib/supabase/types";
import { Check, Save } from "lucide-react";

export function PerfilForm({ profile }: { profile: Profile }) {
  const [isPending, startTransition] = useTransition();
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSalvo(false);
    setErro(null);
    startTransition(async () => {
      const { error } = await atualizarPerfilCliente(formData);
      if (error) {
        setErro(error);
        return;
      }
      setSalvo(true);
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#5c6e6f]">Nome</label>
        <input
          name="nome"
          required
          defaultValue={profile.nome}
          className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#5c6e6f]">Telefone</label>
        <input
          name="telefone"
          defaultValue={profile.telefone ?? ""}
          placeholder="(81) 99999-9999"
          className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#5c6e6f]">E-mail</label>
        <input
          value={profile.email ?? ""}
          disabled
          className="rounded-lg border border-[#e7e2d6] bg-[#f7f8f8] px-3 py-2 text-sm text-[#9db1b1]"
        />
      </div>

      {erro && <p className="text-xs text-[#b3261e]">{erro}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#263f40] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#35494b] disabled:opacity-60"
      >
        {salvo ? <Check size={16} strokeWidth={2.5} /> : <Save size={16} strokeWidth={2.5} />}
        {isPending ? "Salvando..." : salvo ? "Salvo!" : "Salvar alterações"}
      </button>
    </form>
  );
}
