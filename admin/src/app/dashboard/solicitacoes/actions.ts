"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { SolicitacaoParceiro } from "@/lib/supabase/types";

export async function aprovarSolicitacao(solicitacao: SolicitacaoParceiro) {
  const supabase = await createClient();

  // Cria o parceiro (sem user_id ainda — ele será vinculado quando o
  // parceiro criar a conta no portal, usando o mesmo e-mail).
  await supabase.from("parceiros").insert({
    nome_negocio: solicitacao.nome_negocio,
    email: solicitacao.email,
    telefone: solicitacao.telefone,
    status: "aprovado",
  });

  await supabase
    .from("solicitacoes_parceiro")
    .update({ status: "aprovado" })
    .eq("id", solicitacao.id);

  revalidatePath("/dashboard/solicitacoes");
  revalidatePath("/dashboard/parceiros");
}

export async function rejeitarSolicitacao(id: string) {
  const supabase = await createClient();
  await supabase.from("solicitacoes_parceiro").update({ status: "rejeitado" }).eq("id", id);
  revalidatePath("/dashboard/solicitacoes");
}
