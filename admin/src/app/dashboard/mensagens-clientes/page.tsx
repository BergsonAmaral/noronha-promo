import { createClient } from "@/lib/supabase/server";
import type { Mensagem, Profile } from "@/lib/supabase/types";
import Link from "next/link";
import { MessageCircle, UserRound } from "lucide-react";

function formatData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function MensagensClientesInboxPage() {
  const supabase = await createClient();

  const { data: mensagens } = await supabase
    .from("mensagens")
    .select("*")
    .not("cliente_id", "is", null)
    .order("created_at", { ascending: false })
    .returns<Mensagem[]>();

  const clienteIds = Array.from(new Set((mensagens ?? []).map((m) => m.cliente_id!)));

  const { data: clientes } = clienteIds.length
    ? await supabase
        .from("profiles")
        .select("*")
        .in("id", clienteIds)
        .returns<Profile[]>()
    : { data: [] as Profile[] };

  const conversas = (clientes ?? []).map((c) => {
    const doCliente = (mensagens ?? []).filter((m) => m.cliente_id === c.id);
    const ultima = doCliente[0] ?? null;
    const naoLidas = doCliente.filter((m) => m.remetente_role === "cliente" && !m.lida).length;
    return { cliente: c, ultima, naoLidas };
  });

  conversas.sort((a, b) => {
    if (!a.ultima || !b.ultima) return 0;
    return new Date(b.ultima.created_at).getTime() - new Date(a.ultima.created_at).getTime();
  });

  return (
    <div>
      <h1 className="font-head text-2xl font-bold text-[#263f40]">Mensagens</h1>
      <p className="mt-1 text-sm text-[#5c6e6f]">Converse com os clientes do clube.</p>

      <div className="mt-4 mb-6 flex gap-2 text-sm">
        <Link
          href="/dashboard/mensagens"
          className="rounded-lg border border-[#e7e2d6] px-3 py-1.5 font-medium text-[#425c5a] hover:bg-[#f7f8f8]"
        >
          Parceiros
        </Link>
        <span className="rounded-lg bg-[#263f40] px-3 py-1.5 font-medium text-white">
          Clientes
        </span>
      </div>

      <div className="grid gap-3">
        {conversas.map(({ cliente, ultima, naoLidas }) => (
          <Link
            key={cliente.id}
            href={`/dashboard/mensagens-clientes/${cliente.id}`}
            className="flex items-center gap-4 rounded-xl border border-[#e7e2d6] bg-white p-4 transition hover:border-[#48696c]"
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#eef4f2] text-[#48696c]">
              <UserRound size={18} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-head text-sm font-semibold text-[#263f40]">{cliente.nome}</p>
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
            Nenhum cliente iniciou conversa ainda.
          </div>
        )}
      </div>
    </div>
  );
}
