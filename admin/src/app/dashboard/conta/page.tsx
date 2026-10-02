import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile } from "@/lib/supabase/types";
import { AlterarSenhaForm } from "@/components/alterar-senha-form";
import { UserRound, Mail } from "lucide-react";

export default async function ContaPage() {
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

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-head text-2xl font-bold text-[#263f40]">Minha conta</h1>
        <p className="mt-1 text-sm text-[#5c6e6f]">
          Seus dados de acesso ao painel administrativo.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#eef4f2] text-[#48696c]">
          <UserRound size={22} strokeWidth={2} />
        </span>
        <div>
          <p className="font-head font-semibold text-[#263f40]">{profile?.nome}</p>
          <p className="flex items-center gap-1.5 text-sm text-[#5c6e6f]">
            <Mail size={13} strokeWidth={2} />
            {profile?.email ?? "sem e-mail"}
          </p>
        </div>
      </div>

      <AlterarSenhaForm />
    </div>
  );
}
