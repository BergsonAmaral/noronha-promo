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

  const { data, error } = await supabase.rpc("comprar_beneficio", {
    p_beneficio_id: beneficioId,
  });

  if (error) return { error: error.message, codigo: null };

  revalidatePath("/cliente");
  revalidatePath("/cliente/descobrir");
  return { error: null, codigo: data as string };
}
