"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ParceiroStatus } from "@/lib/supabase/types";

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
