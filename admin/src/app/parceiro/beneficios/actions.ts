"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { BeneficioStatus, TipoDesconto } from "@/lib/supabase/types";

async function exigirParceiro() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, parceiroId: null };

  const { data: parceiro } = await supabase
    .from("parceiros")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  return { supabase, parceiroId: parceiro?.id ?? null };
}

export async function criarBeneficio(formData: FormData) {
  const { supabase, parceiroId } = await exigirParceiro();
  if (!parceiroId) return;

  const categoria_id = String(formData.get("categoria_id") ?? "") || null;
  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const tipo_desconto = String(formData.get("tipo_desconto") ?? "percentual") as TipoDesconto;
  const valor_desconto = formData.get("valor_desconto")
    ? Number(formData.get("valor_desconto"))
    : null;
  const valor_original = formData.get("valor_original")
    ? Number(formData.get("valor_original"))
    : null;
  const preco = Number(formData.get("preco") ?? 0);
  const condicoes = String(formData.get("condicoes") ?? "").trim();
  const imagem_url = String(formData.get("imagem_url") ?? "").trim();
  const limite_resgates = formData.get("limite_resgates") ? Number(formData.get("limite_resgates")) : null;
  const limite_por_cliente = formData.get("limite_por_cliente") ? Number(formData.get("limite_por_cliente")) : null;
  const validade_fim = String(formData.get("validade_fim") ?? "") || null;

  if (!titulo) return;

  await supabase.from("beneficios").insert({
    parceiro_id: parceiroId,
    categoria_id,
    titulo,
    descricao: descricao || null,
    tipo_desconto,
    valor_desconto,
    valor_original,
    preco,
    condicoes: condicoes || null,
    imagem_url: imagem_url || null,
    validade_fim,
    limite_resgates,
    limite_por_cliente,
    status: "ativo",
  });

  revalidatePath("/parceiro/beneficios");
}

export async function atualizarStatusBeneficio(id: string, status: BeneficioStatus) {
  const { supabase, parceiroId } = await exigirParceiro();
  if (!parceiroId) return;

  await supabase.from("beneficios").update({ status }).eq("id", id).eq("parceiro_id", parceiroId);
  revalidatePath("/parceiro/beneficios");
}

export async function excluirBeneficio(id: string) {
  const { supabase, parceiroId } = await exigirParceiro();
  if (!parceiroId) return;

  const { count } = await supabase
    .from("resgates")
    .select("id", { count: "exact", head: true })
    .eq("beneficio_id", id);
  if (count) {
    await supabase.from("beneficios").update({ status: "pausado" }).eq("id", id).eq("parceiro_id", parceiroId);
  } else {
    await supabase.from("beneficios").delete().eq("id", id).eq("parceiro_id", parceiroId);
  }
  revalidatePath("/parceiro/beneficios");
}
