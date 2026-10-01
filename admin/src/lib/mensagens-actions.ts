"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Mensagem } from "@/lib/supabase/types";

export async function listarMensagens(parceiroId: string): Promise<Mensagem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mensagens")
    .select("*")
    .eq("parceiro_id", parceiroId)
    .order("created_at", { ascending: true })
    .returns<Mensagem[]>();
  return data ?? [];
}

export async function enviarMensagem(
  parceiroId: string,
  texto: string
): Promise<{ error: string | null }> {
  const mensagem = texto.trim();
  if (!mensagem) return { error: null };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile) return { error: "Perfil não encontrado." };

  const { error } = await supabase.from("mensagens").insert({
    parceiro_id: parceiroId,
    remetente_id: user.id,
    remetente_role: profile.role,
    mensagem,
  });

  if (error) return { error: error.message };

  revalidatePath(
    profile.role === "admin" ? `/dashboard/mensagens/${parceiroId}` : "/parceiro/mensagens"
  );
  revalidatePath("/dashboard/mensagens");
  return { error: null };
}

export async function marcarComoLida(parceiroId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile) return;

  await supabase
    .from("mensagens")
    .update({ lida: true })
    .eq("parceiro_id", parceiroId)
    .neq("remetente_role", profile.role)
    .eq("lida", false);
}
