"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function criarCategoria(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const icone = String(formData.get("icone") ?? "compass").trim();
  if (!nome) return;

  const supabase = await createClient();
  await supabase.from("categorias").insert({
    nome,
    slug: slugify(nome),
    icone,
  });

  revalidatePath("/dashboard/categorias");
}

export async function alternarCategoria(id: string, ativo: boolean) {
  const supabase = await createClient();
  await supabase.from("categorias").update({ ativo: !ativo }).eq("id", id);
  revalidatePath("/dashboard/categorias");
}

export async function excluirCategoria(id: string) {
  const supabase = await createClient();
  await supabase.from("categorias").delete().eq("id", id);
  revalidatePath("/dashboard/categorias");
}
