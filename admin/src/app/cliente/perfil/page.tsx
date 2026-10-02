import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile } from "@/lib/supabase/types";
import { PerfilForm } from "./perfil-form";
import { AlterarSenhaForm } from "@/components/alterar-senha-form";

export default async function PerfilClientePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!profile) redirect("/login");

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="font-head text-xl font-bold text-[#263f40]">Meu perfil</h1>
        <p className="mt-1 mb-6 text-sm text-[#5c6e6f]">Seus dados pessoais.</p>
        <PerfilForm profile={profile} />
      </div>

      <AlterarSenhaForm />
    </div>
  );
}
