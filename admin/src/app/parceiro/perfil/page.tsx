import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Avaliacao, Categoria, Parceiro, Profile } from "@/lib/supabase/types";
import { PerfilForm } from "./perfil-form";
import { AlterarSenhaForm } from "@/components/alterar-senha-form";
import { AvaliacoesResumo } from "@/components/avaliacoes-resumo";

export default async function PerfilParceiroPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: parceiro }, { data: categorias }] = await Promise.all([
    supabase.from("parceiros").select("*").eq("user_id", user.id).maybeSingle<Parceiro>(),
    supabase.from("categorias").select("*").order("ordem").returns<Categoria[]>(),
  ]);

  if (!parceiro) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="font-head text-xl font-bold text-[#263f40]">Meu perfil</h1>
        <p className="mt-3 text-sm text-[#5c6e6f]">
          Nenhum negócio vinculado a este usuário ainda. Fale com o administrador.
        </p>
      </div>
    );
  }

  const { data: avaliacoes } = await supabase
    .from("avaliacoes")
    .select("*, profiles(nome)")
    .eq("parceiro_id", parceiro.id)
    .order("created_at", { ascending: false })
    .returns<(Avaliacao & { profiles: Pick<Profile, "nome"> | null })[]>();

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="font-head text-xl font-bold text-[#263f40]">Meu perfil</h1>
        <p className="mt-1 mb-6 text-sm text-[#5c6e6f]">
          Dados do seu negócio exibidos no site e para os clientes.
        </p>
        <PerfilForm parceiro={parceiro} categorias={categorias ?? []} />
      </div>

      <AlterarSenhaForm />

      <AvaliacoesResumo avaliacoes={avaliacoes ?? []} />
    </div>
  );
}
