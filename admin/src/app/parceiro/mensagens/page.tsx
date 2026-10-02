import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Parceiro } from "@/lib/supabase/types";
import { ChatThread } from "@/components/chat-thread";
import { listarMensagens } from "@/lib/mensagens-actions";

export default async function MensagensParceiroPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: parceiro } = await supabase
    .from("parceiros")
    .select("id, nome_negocio")
    .eq("user_id", user.id)
    .maybeSingle<Pick<Parceiro, "id" | "nome_negocio">>();

  if (!parceiro) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="font-head text-xl font-bold text-[#263f40]">Mensagens</h1>
        <p className="mt-3 text-sm text-[#5c6e6f]">
          Nenhum negócio vinculado a este usuário ainda.
        </p>
      </div>
    );
  }

  const mensagens = await listarMensagens({ parceiro_id: parceiro.id });

  return (
    <ChatThread
      filtro={{ parceiro_id: parceiro.id }}
      meRole="parceiro"
      counterpartLabel="Suporte Noronha Promo"
      initialMensagens={mensagens}
    />
  );
}
