import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Profile } from "@/lib/supabase/types";
import { ChatThread } from "@/components/chat-thread";
import { listarMensagens } from "@/lib/mensagens-actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function MensagensClienteThreadPage({
  params,
}: {
  params: Promise<{ clienteId: string }>;
}) {
  const { clienteId } = await params;
  const supabase = await createClient();

  const { data: cliente } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", clienteId)
    .maybeSingle<Profile>();

  if (!cliente) notFound();

  const mensagens = await listarMensagens({ cliente_id: clienteId });

  return (
    <div>
      <Link
        href="/dashboard/mensagens-clientes"
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-[#5c6e6f] hover:text-[#263f40]"
      >
        <ArrowLeft size={15} strokeWidth={2} />
        Todas as conversas
      </Link>
      <ChatThread
        filtro={{ cliente_id: cliente.id }}
        meRole="admin"
        counterpartLabel={cliente.nome}
        initialMensagens={mensagens}
      />
    </div>
  );
}
