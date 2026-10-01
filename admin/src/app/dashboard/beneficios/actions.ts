"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { BeneficioStatus } from "@/lib/supabase/types";

export async function atualizarStatusBeneficio(id: string, status: BeneficioStatus) {
  const supabase = await createClient();
  await supabase.from("beneficios").update({ status }).eq("id", id);
  revalidatePath("/dashboard/beneficios");
}
