"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function comprarBeneficio(
  beneficioId: string
): Promise<{ error: string | null; codigo: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado.", codigo: null };

  const { data: beneficio } = await supabase
    .from("beneficios")
    .select("preco, status")
    .eq("id", beneficioId)
    .single();

  if (!beneficio) return { error: "Benefício não encontrado.", codigo: null };
  if (beneficio.status !== "ativo") {
    return { error: "Esse benefício não está mais disponível.", codigo: null };
  }

  const { data, error } = await supabase
    .from("resgates")
    .insert({
      beneficio_id: beneficioId,
      cliente_id: user.id,
      status: "pago",
      valor_pago: beneficio.preco,
      pago_em: new Date().toISOString(),
    })
    .select("codigo")
    .single();

  if (error) return { error: error.message, codigo: null };

  revalidatePath("/cliente");
  revalidatePath("/cliente/descobrir");
  return { error: null, codigo: data.codigo };
}
