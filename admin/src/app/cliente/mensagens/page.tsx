import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChatThread } from "@/components/chat-thread";
import { listarMensagens } from "@/lib/mensagens-actions";

export default async function MensagensClientePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const mensagens = await listarMensagens({ cliente_id: user.id });

  return (
    <ChatThread
      filtro={{ cliente_id: user.id }}
      meRole="cliente"
      counterpartLabel="Suporte Noronha Promo"
      initialMensagens={mensagens}
    />
  );
}
