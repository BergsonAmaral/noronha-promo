"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function atualizarPerfilCliente(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const nome = String(formData.get("nome") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();

  if (!nome) return { error: "O nome é obrigatório." };

  const { error } = await supabase
    .from("profiles")
    .update({ nome, telefone: telefone || null })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/cliente/perfil");
  revalidatePath("/cliente");
  return { error: null };
}
