"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function criarAvaliacao(
  resgateId: string,
  parceiroId: string,
  nota: number,
  comentario: string
): Promise<{ error: string | null }> {
  if (nota < 1 || nota > 5) return { error: "Escolha de 1 a 5 estrelas." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const { error } = await supabase.from("avaliacoes").insert({
    parceiro_id: parceiroId,
    cliente_id: user.id,
    resgate_id: resgateId,
    nota,
    comentario: comentario.trim() || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/cliente");
  revalidatePath("/parceiro/perfil");
  return { error: null };
}
