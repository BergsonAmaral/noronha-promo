"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function criarCliente(
  nome: string,
  email: string,
  senha: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") return { error: "Acesso restrito ao admin." };

  if (!nome.trim()) return { error: "Informe o nome do cliente." };
  if (!email.trim() || senha.length < 6) {
    return { error: "Informe um e-mail e uma senha com pelo menos 6 caracteres." };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email: email.trim(),
    password: senha,
    email_confirm: true,
    user_metadata: { nome: nome.trim(), role: "cliente" },
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard/clientes");
  return { error: null };
}
