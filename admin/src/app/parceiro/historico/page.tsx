import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Beneficio, Profile, Resgate } from "@/lib/supabase/types";
import { CheckCircle2, History } from "lucide-react";

type ResgateComDetalhes = Resgate & {
  beneficios: Pick<Beneficio, "titulo"> | null;
  profiles: Pick<Profile, "nome"> | null;
};

function formatData(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function HistoricoParceiroPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: resgates } = await supabase
    .from("resgates")
    .select("*, beneficios(titulo), profiles(nome)")
    .eq("status", "utilizado")
    .order("utilizado_em", { ascending: false })
    .returns<ResgateComDetalhes[]>();

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="font-head text-xl font-bold text-[#263f40]">Histórico de cupons</h1>
      <p className="mt-1 mb-6 text-sm text-[#5c6e6f]">
        Cupons já validados e utilizados pelos clientes no seu negócio.
      </p>

      <div className="grid gap-3">
        {resgates?.map((r) => (
          <div
            key={r.id}
            className="flex items-start gap-3 rounded-xl border border-[#e7e2d6] p-4"
          >
            <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={16} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-head text-sm font-semibold text-[#263f40]">
                {r.beneficios?.titulo ?? "Benefício removido"}
              </p>
              <p className="mt-0.5 text-sm text-[#5c6e6f]">
                {r.profiles?.nome ?? "Cliente"} · código{" "}
                <span className="font-mono">{r.codigo}</span>
              </p>
              <p className="mt-1 text-xs text-[#9db1b1]">
                Validado em {formatData(r.utilizado_em)}
              </p>
            </div>
          </div>
        ))}

        {!resgates?.length && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#e7e2d6] p-8 text-center text-[#5c6e6f]">
            <History size={22} strokeWidth={2} className="text-[#9db1b1]" />
            Nenhum cupom validado ainda.
          </div>
        )}
      </div>
    </div>
  );
}
