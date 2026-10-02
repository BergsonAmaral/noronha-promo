import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile } from "@/lib/supabase/types";
import { DashboardShell } from "./dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  if (!profile || profile.role !== "admin") {
    redirect("/login?error=Acesso restrito ao time administrativo");
  }

  const { count: mensagensNaoLidas } = await supabase
    .from("mensagens")
    .select("id", { count: "exact", head: true })
    .neq("remetente_role", "admin")
    .eq("lida", false);

  return (
    <DashboardShell profile={profile} mensagensNaoLidas={mensagensNaoLidas ?? 0}>
      {children}
    </DashboardShell>
  );
}
