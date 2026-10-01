"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ParceiroStatus } from "@/lib/supabase/types";

export async function atualizarStatusParceiro(id: string, status: ParceiroStatus) {
  const supabase = await createClient();
  await supabase.from("parceiros").update({ status }).eq("id", id);
  revalidatePath("/dashboard/parceiros");
}
