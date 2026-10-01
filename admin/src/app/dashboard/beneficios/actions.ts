"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { BeneficioStatus, TipoDesconto } from "@/lib/supabase/types";

export async function atualizarStatusBeneficio(id: string, status: BeneficioStatus) {
  const supabase = await createClient();
  await supabase.from("beneficios").update({ status }).eq("id", id);
  revalidatePath("/dashboard/beneficios");
}

export async function criarBeneficio(formData: FormData) {
  const parceiro_id = String(formData.get("parceiro_id") ?? "");
  const categoria_id = String(formData.get("categoria_id") ?? "") || null;
  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const tipo_desconto = String(formData.get("tipo_desconto") ?? "percentual") as TipoDesconto;
  const valor_desconto = formData.get("valor_desconto")
    ? Number(formData.get("valor_desconto"))
    : null;
  const preco = Number(formData.get("preco") ?? 0);
  const condicoes = String(formData.get("condicoes") ?? "").trim();
  const validade_fim = String(formData.get("validade_fim") ?? "") || null;

  if (!parceiro_id || !titulo) return;

  const supabase = await createClient();
  await supabase.from("beneficios").insert({
    parceiro_id,
    categoria_id,
    titulo,
    descricao: descricao || null,
    tipo_desconto,
    valor_desconto,
    preco,
    condicoes: condicoes || null,
    validade_fim,
    status: "ativo",
  });

  revalidatePath("/dashboard/beneficios");
}

export async function excluirBeneficio(id: string) {
  const supabase = await createClient();
  await supabase.from("beneficios").delete().eq("id", id);
  revalidatePath("/dashboard/beneficios");
}

// Gera um resgate de teste (cupom "pago") para o admin poder testar o
// scanner do parceiro antes do portal do cliente existir de verdade.
export async function gerarCupomTeste(
  beneficioId: string
): Promise<{ codigo: string | null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { codigo: null, error: "Não autenticado." };

  const { data: beneficio } = await supabase
    .from("beneficios")
    .select("preco")
    .eq("id", beneficioId)
    .single();

  const { data, error } = await supabase
    .from("resgates")
    .insert({
      beneficio_id: beneficioId,
      cliente_id: user.id,
      status: "pago",
      valor_pago: beneficio?.preco ?? 0,
      pago_em: new Date().toISOString(),
    })
    .select("codigo")
    .single();

  if (error) return { codigo: null, error: error.message };
  return { codigo: data.codigo, error: null };
}
