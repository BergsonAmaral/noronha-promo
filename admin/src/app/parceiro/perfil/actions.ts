"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function atualizarPerfilParceiro(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const categoria_id = String(formData.get("categoria_id") ?? "") || null;
  const nome_negocio = String(formData.get("nome_negocio") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const instagram = String(formData.get("instagram") ?? "").trim();
  const endereco = String(formData.get("endereco") ?? "").trim();
  const logo_url = String(formData.get("logo_url") ?? "").trim();

  if (!nome_negocio) return { error: "O nome do negócio é obrigatório." };

  const { error } = await supabase
    .from("parceiros")
    .update({
      categoria_id,
      nome_negocio,
      descricao: descricao || null,
      telefone: telefone || null,
      whatsapp: whatsapp || null,
      email: email || null,
      instagram: instagram || null,
      endereco: endereco || null,
      logo_url: logo_url || null,
    })
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/parceiro/perfil");
  return { error: null };
}

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
