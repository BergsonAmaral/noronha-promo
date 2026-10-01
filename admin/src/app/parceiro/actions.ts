"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CupomInfo {
  resgate_id: string;
  status: "aguardando_pagamento" | "pago" | "utilizado" | "expirado" | "cancelado";
  beneficio_titulo: string;
  tipo_desconto: "percentual" | "valor_fixo" | "outro";
  valor_desconto: number | null;
  cliente_nome: string;
  resgatado_em: string;
  utilizado_em: string | null;
}

export async function consultarCupom(
  codigo: string
): Promise<{ data: CupomInfo | null; error: string | null }> {
  if (!codigo.trim()) return { data: null, error: "Informe o código do cupom." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("consultar_cupom", { p_codigo: codigo.trim() });

  if (error) return { data: null, error: error.message };
  if (!data?.length) return { data: null, error: "Cupom não encontrado para o seu negócio." };

  return { data: data[0] as CupomInfo, error: null };
}

export async function usarCupom(
  codigo: string
): Promise<{ sucesso: boolean; mensagem: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("usar_cupom", { p_codigo: codigo.trim() });

  revalidatePath("/parceiro");

  if (error) return { sucesso: false, mensagem: error.message };
  if (!data?.length) return { sucesso: false, mensagem: "Não foi possível validar o cupom." };

  return { sucesso: data[0].sucesso, mensagem: data[0].mensagem };
}
