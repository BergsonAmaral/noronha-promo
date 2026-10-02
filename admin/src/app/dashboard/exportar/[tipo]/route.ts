import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function csv(linhas: (string | number | null)[][]) {
  const esc = (v: string | number | null) => {
    let s = v == null ? "" : String(v);
    if (/^[=+\-@]/.test(s)) s = `'${s}`;
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return "﻿" + linhas.map((l) => l.map(esc).join(",")).join("\n");
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tipo: string }> }
) {
  const { tipo } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Não autenticado", { status: 401 });
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") return new NextResponse("Acesso restrito", { status: 403 });

  let corpo: string;
  if (tipo === "clientes") {
    const { data } = await supabase
      .from("profiles")
      .select("nome, email, created_at")
      .eq("role", "cliente")
      .order("created_at", { ascending: false });
    corpo = csv([
      ["nome", "email", "cadastrado_em"],
      ...(data ?? []).map((c) => [c.nome, c.email, c.created_at]),
    ]);
  } else if (tipo === "vendas") {
    const { data } = await supabase
      .from("resgates")
      .select(
        "codigo, status, valor_pago, pago_em, utilizado_em, beneficios(titulo, parceiros(nome_negocio)), profiles(nome, email)"
      )
      .order("resgatado_em", { ascending: false });
    type Linha = {
      codigo: string;
      status: string;
      valor_pago: number | null;
      pago_em: string | null;
      utilizado_em: string | null;
      beneficios: { titulo: string; parceiros: { nome_negocio: string } | null } | null;
      profiles: { nome: string; email: string | null } | null;
    };
    corpo = csv([
      ["codigo", "status", "valor_pago", "pago_em", "utilizado_em", "beneficio", "parceiro", "cliente", "email_cliente"],
      ...((data ?? []) as unknown as Linha[]).map((r) => [
        r.codigo,
        r.status,
        r.valor_pago,
        r.pago_em,
        r.utilizado_em,
        r.beneficios?.titulo ?? "",
        r.beneficios?.parceiros?.nome_negocio ?? "",
        r.profiles?.nome ?? "",
        r.profiles?.email ?? "",
      ]),
    ]);
  } else {
    return new NextResponse("Tipo inválido", { status: 404 });
  }

  return new NextResponse(corpo, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${tipo}-noronha-promo.csv"`,
    },
  });
}
