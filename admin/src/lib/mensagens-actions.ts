"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Mensagem } from "@/lib/supabase/types";

export type ThreadFiltro = { parceiro_id: string } | { cliente_id: string };

function aplicarFiltro<T extends { eq: (col: string, val: string) => T }>(
  query: T,
  filtro: ThreadFiltro
): T {
  return "parceiro_id" in filtro
    ? query.eq("parceiro_id", filtro.parceiro_id)
    : query.eq("cliente_id", filtro.cliente_id);
}

export async function listarMensagens(filtro: ThreadFiltro): Promise<Mensagem[]> {
  const supabase = await createClient();
  const query = aplicarFiltro(
    supabase.from("mensagens").select("*").order("created_at", { ascending: true }),
    filtro
  );
  const { data } = await query.returns<Mensagem[]>();
  return data ?? [];
}

export async function enviarMensagem(
  filtro: ThreadFiltro,
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
    ...("parceiro_id" in filtro
      ? { parceiro_id: filtro.parceiro_id }
      : { cliente_id: filtro.cliente_id }),
    remetente_id: user.id,
    remetente_role: profile.role,
    mensagem,
  });

  if (error) return { error: error.message };

  if ("parceiro_id" in filtro) {
    revalidatePath(
      profile.role === "admin"
        ? `/dashboard/mensagens/${filtro.parceiro_id}`
        : "/parceiro/mensagens"
    );
    revalidatePath("/dashboard/mensagens");
  } else {
    revalidatePath(
      profile.role === "admin"
        ? `/dashboard/mensagens-clientes/${filtro.cliente_id}`
        : "/cliente/mensagens"
    );
    revalidatePath("/dashboard/mensagens-clientes");
  }

  return { error: null };
}

export async function marcarComoLida(filtro: ThreadFiltro): Promise<void> {
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

  const query = aplicarFiltro(
    supabase
      .from("mensagens")
      .update({ lida: true })
      .neq("remetente_role", profile.role)
      .eq("lida", false),
    filtro
  );
  await query;
}
