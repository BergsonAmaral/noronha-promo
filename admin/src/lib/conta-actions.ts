"use server";

import { createClient } from "@/lib/supabase/server";

export async function alterarSenha(
  novaSenha: string,
  confirmarSenha: string
): Promise<{ error: string | null }> {
  if (novaSenha.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }
  if (novaSenha !== confirmarSenha) {
    return { error: "As senhas não coincidem." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const { error } = await supabase.auth.updateUser({ password: novaSenha });
  if (error) return { error: error.message };

  return { error: null };
}
