import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile } from "@/lib/supabase/types";
import { HOME_BY_ROLE } from "@/lib/role-routing";

export default async function ParceiroLayout({
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

  if (!profile || (profile.role !== "parceiro" && profile.role !== "admin")) {
    redirect(HOME_BY_ROLE[profile?.role ?? "cliente"]);
  }

  return <div className="min-h-screen bg-[#f7f8f8]">{children}</div>;
}
