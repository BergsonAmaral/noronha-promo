"use client";

import { useRef, useState, useTransition } from "react";
import { atualizarPerfilParceiro } from "./actions";
import type { Categoria, Parceiro } from "@/lib/supabase/types";
import { ImageUpload } from "@/components/image-upload";
import { Check, Save } from "lucide-react";

export function PerfilForm({
  parceiro,
  categorias,
}: {
  parceiro: Parceiro;
  categorias: Categoria[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSalvo(false);
    setErro(null);
    startTransition(async () => {
      const { error } = await atualizarPerfilParceiro(formData);
      if (error) {
        setErro(error);
        return;
      }
      setSalvo(true);
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#5c6e6f]">Nome do negócio</label>
        <input
          name="nome_negocio"
          required
          defaultValue={parceiro.nome_negocio}
          className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#5c6e6f]">Categoria</label>
        <select
          name="categoria_id"
          defaultValue={parceiro.categoria_id ?? ""}
          className="rounded-lg border border-[#e7e2d6] bg-white px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
        >
          <option value="">Sem categoria</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#5c6e6f]">Descrição</label>
        <textarea
          name="descricao"
          rows={3}
          defaultValue={parceiro.descricao ?? ""}
          className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#5c6e6f]">Telefone</label>
          <input
            name="telefone"
            defaultValue={parceiro.telefone ?? ""}
            className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#5c6e6f]">WhatsApp</label>
          <input
            name="whatsapp"
            defaultValue={parceiro.whatsapp ?? ""}
            className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#5c6e6f]">E-mail</label>
        <input
          name="email"
          type="email"
          defaultValue={parceiro.email ?? ""}
          className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#5c6e6f]">Instagram</label>
          <input
            name="instagram"
            placeholder="@seu_negocio"
            defaultValue={parceiro.instagram ?? ""}
            className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
          />
        </div>
        <ImageUpload name="logo_url" label="Logo" defaultValue={parceiro.logo_url ?? ""} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#5c6e6f]">Endereço</label>
        <input
          name="endereco"
          defaultValue={parceiro.endereco ?? ""}
          className="rounded-lg border border-[#e7e2d6] px-3 py-2 text-sm text-[#263f40] outline-none focus:border-[#48696c]"
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
