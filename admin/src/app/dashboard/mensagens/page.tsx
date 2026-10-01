import { createClient } from "@/lib/supabase/server";
import type { Mensagem, Parceiro } from "@/lib/supabase/types";
import Link from "next/link";
import { MessageCircle, Store } from "lucide-react";

type ParceiroComChat = Pick<Parceiro, "id" | "nome_negocio"> & { user_id: string | null };

function formatData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function MensagensInboxPage() {
  const supabase = await createClient();

  const [{ data: parceiros }, { data: mensagens }] = await Promise.all([
    supabase
      .from("parceiros")
      .select("id, nome_negocio, user_id")
      .not("user_id", "is", null)
      .order("nome_negocio")
      .returns<ParceiroComChat[]>(),
    supabase
      .from("mensagens")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<Mensagem[]>(),
  ]);

  const conversas = (parceiros ?? []).map((p) => {
    const doParceiro = (mensagens ?? []).filter((m) => m.parceiro_id === p.id);
    const ultima = doParceiro[0] ?? null;
    const naoLidas = doParceiro.filter(
      (m) => m.remetente_role === "parceiro" && !m.lida
    ).length;
    return { parceiro: p, ultima, naoLidas };
  });

  conversas.sort((a, b) => {
    if (!a.ultima && !b.ultima) return 0;
    if (!a.ultima) return 1;
    if (!b.ultima) return -1;
    return (
      new Date(b.ultima.created_at).getTime() - new Date(a.ultima.created_at).getTime()
    );
  });

  return (
    <div>
      <h1 className="font-head text-2xl font-bold text-[#263f40]">Mensagens</h1>
      <p className="mt-1 mb-6 text-sm text-[#5c6e6f]">
        Converse com os parceiros que já têm login no clube.
      </p>

      <div className="grid gap-3">
        {conversas.map(({ parceiro, ultima, naoLidas }) => (
          <Link
            key={parceiro.id}
            href={`/dashboard/mensagens/${parceiro.id}`}
            className="flex items-center gap-4 rounded-xl border border-[#e7e2d6] bg-white p-4 transition hover:border-[#48696c]"
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#eef4f2] text-[#48696c]">
              <Store size={18} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-head text-sm font-semibold text-[#263f40]">
                {parceiro.nome_negocio}
              </p>
              <p className="truncate text-sm text-[#5c6e6f]">
                {ultima ? ultima.mensagem : "Nenhuma mensagem ainda"}
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-col items-end gap-1">
              {ultima && (
                <span className="text-xs text-[#9db1b1]">{formatData(ultima.created_at)}</span>
              )}
              {naoLidas > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#df9c28] px-1.5 text-[11px] font-bold text-white">
                  {naoLidas}
                </span>
              )}
            </div>
          </Link>
        ))}

        {!conversas.length && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#e7e2d6] bg-white p-8 text-center text-[#5c6e6f]">
            <MessageCircle size={22} strokeWidth={2} className="text-[#9db1b1]" />
            Nenhum parceiro com login criado ainda.
          </div>
        )}
      </div>
    </div>
  );
}
