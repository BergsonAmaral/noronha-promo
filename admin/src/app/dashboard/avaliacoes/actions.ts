"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function excluirAvaliacao(id: string) {
  const supabase = await createClient();
  await supabase.from("avaliacoes").delete().eq("id", id);
  revalidatePath("/dashboard/avaliacoes");
}
