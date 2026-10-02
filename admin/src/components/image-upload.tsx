"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImagePlus, X } from "lucide-react";

export function ImageUpload({
  name,
  label,
  defaultValue = "",
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErro("Use uma imagem JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setErro("A imagem precisa ter até 3 MB.");
      return;
    }
    setErro(null);
    setEnviando(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setEnviando(false);
      setErro("Sessão expirada. Entre novamente.");
      return;
    }
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("imagens").upload(path, file, {
      contentType: file.type,
    });
    setEnviando(false);
    if (error) {
      setErro("Não foi possível enviar a imagem.");
      return;
    }
    setUrl(supabase.storage.from("imagens").getPublicUrl(path).data.publicUrl);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#5c6e6f]">{label}</label>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-3">
        {url ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-16 w-16 rounded-lg border border-[#e7e2d6] object-cover" />
            <button
              type="button"
              onClick={() => setUrl("")}
              className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#263f40] text-white"
              aria-label="Remover imagem"
            >
              <X size={12} />
            </button>
          </div>
        ) : null}
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#c9c2ae] px-3 py-2 text-sm font-medium text-[#425c5a] hover:bg-[#f7f8f8]">
          <ImagePlus size={16} />
          {enviando ? "Enviando..." : url ? "Trocar imagem" : "Enviar imagem"}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} className="hidden" disabled={enviando} />
        </label>
      </div>
      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  );
}
