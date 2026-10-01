import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Parceiro } from "@/lib/supabase/types";
import { ChatThread } from "@/components/chat-thread";
import { listarMensagens } from "@/lib/mensagens-actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function MensagensThreadPage({
  params,
}: {
  params: Promise<{ parceiroId: string }>;
}) {
  const { parceiroId } = await params;
  const supabase = await createClient();

  const { data: parceiro } = await supabase
    .from("parceiros")
    .select("id, nome_negocio")
    .eq("id", parceiroId)
    .maybeSingle<Pick<Parceiro, "id" | "nome_negocio">>();

  if (!parceiro) notFound();

  const mensagens = await listarMensagens(parceiroId);

  return (
    <div>
      <Link
        href="/dashboard/mensagens"
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-[#5c6e6f] hover:text-[#263f40]"
      >
        <ArrowLeft size={15} strokeWidth={2} />
        Todas as conversas
      </Link>
      <ChatThread
        parceiroId={parceiro.id}
        meRole="admin"
        counterpartLabel={parceiro.nome_negocio}
        initialMensagens={mensagens}
      />
    </div>
  );
}
