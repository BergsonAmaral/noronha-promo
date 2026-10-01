import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HOME_BY_ROLE } from "@/lib/role-routing";
import type { Profile } from "@/lib/supabase/types";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<Pick<Profile, "role">>();

  redirect(HOME_BY_ROLE[profile?.role ?? "cliente"]);
}
