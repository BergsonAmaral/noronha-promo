"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile } from "@/lib/supabase/types";
import { HOME_BY_ROLE } from "@/lib/role-routing";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.noronhapromo.com.br";

export async function pedirRedefinicao(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (email) {
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE}/portal/auth/callback?next=/redefinir-senha`,
    });
  }
  redirect("/login/esqueci?enviado=1");
}

export async function reenviarConfirmacao(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (email) {
    const supabase = await createClient();
    await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${SITE}/portal/auth/callback?next=/cliente` },
    });
  }
  redirect("/login/esqueci?reenviado=1");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    redirect(`/login?error=${encodeURIComponent(error?.message ?? "Erro ao entrar")}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single<Pick<Profile, "role">>();

  redirect(HOME_BY_ROLE[profile?.role ?? "cliente"]);
}

export async function signUp(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!nome || !email || password.length < 6) {
    redirect(
      `/login/cadastro?error=${encodeURIComponent(
        "Preencha nome, e-mail e uma senha com pelo menos 6 caracteres."
      )}`
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nome }, emailRedirectTo: `${SITE}/portal/auth/callback?next=/cliente` },
  });

  if (error) {
    redirect(`/login/cadastro?error=${encodeURIComponent(error.message)}`);
  }

  if (data.session) {
    redirect(HOME_BY_ROLE.cliente);
  }

  redirect("/login/cadastro?confirmar=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
