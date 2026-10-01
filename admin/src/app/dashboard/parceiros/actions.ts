"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { ParceiroStatus } from "@/lib/supabase/types";

async function exigirAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, erro: "Não autenticado." };

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") return { supabase, erro: "Acesso restrito ao admin." };

  return { supabase, erro: null };
}

export async function criarAcessoParceiro(
  parceiroId: string,
  email: string,
  senha: string
): Promise<{ error: string | null }> {
  const { supabase, erro } = await exigirAdmin();
  if (erro) return { error: erro };

  if (!email.trim() || senha.length < 6) {
    return { error: "Informe um e-mail e uma senha com pelo menos 6 caracteres." };
  }

  const { data: parceiro } = await supabase
    .from("parceiros")
    .select("nome_negocio, user_id")
    .eq("id", parceiroId)
    .single();
  if (!parceiro) return { error: "Parceiro não encontrado." };
  if (parceiro.user_id) return { error: "Esse parceiro já tem acesso criado." };

  const admin = createAdminClient();
  const { data: criado, error: erroCriacao } = await admin.auth.admin.createUser({
    email: email.trim(),
    password: senha,
    email_confirm: true,
    user_metadata: { nome: parceiro.nome_negocio, role: "parceiro" },
  });
  if (erroCriacao) return { error: erroCriacao.message };

  const { error: erroVinculo } = await supabase
    .from("parceiros")
    .update({ user_id: criado.user.id })
    .eq("id", parceiroId);
  if (erroVinculo) return { error: erroVinculo.message };

  revalidatePath("/dashboard/parceiros");
  return { error: null };
}

export async function atualizarStatusParceiro(id: string, status: ParceiroStatus) {
  const supabase = await createClient();
  await supabase.from("parceiros").update({ status }).eq("id", id);
  revalidatePath("/dashboard/parceiros");
}

export async function criarParceiro(formData: FormData) {
  const nome_negocio = String(formData.get("nome_negocio") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const categoria_id = String(formData.get("categoria_id") ?? "") || null;
  const descricao = String(formData.get("descricao") ?? "").trim();

  if (!nome_negocio) return;

  const supabase = await createClient();
  await supabase.from("parceiros").insert({
    nome_negocio,
    email: email || null,
    telefone: telefone || null,
    categoria_id,
    descricao: descricao || null,
    status: "aprovado",
  });

  revalidatePath("/dashboard/parceiros");
}

export async function excluirParceiro(id: string) {
  const supabase = await createClient();
  await supabase.from("parceiros").delete().eq("id", id);
  revalidatePath("/dashboard/parceiros");
}
