import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Beneficio, Parceiro, Resgate } from "@/lib/supabase/types";
import { CupomCard, type CupomCardData } from "@/components/cupom-card";
import { Ticket } from "lucide-react";

type ResgateComDetalhes = Resgate & {
  beneficios:
    | (Pick<Beneficio, "titulo" | "tipo_desconto" | "valor_desconto" | "condicoes"> & {
        parceiros: Pick<Parceiro, "nome_negocio"> | null;
      })
    | null;
};

function toCard(r: ResgateComDetalhes): CupomCardData {
  return {
    codigo: r.codigo,
    titulo: r.beneficios?.titulo ?? "Benefício",
    parceiro: r.beneficios?.parceiros?.nome_negocio ?? "Noronha Promo",
    condicoes: r.beneficios?.condicoes ?? null,
    tipo_desconto: r.beneficios?.tipo_desconto ?? "outro",
    valor_desconto: r.beneficios?.valor_desconto ?? null,
    utilizado: r.status === "utilizado",
    utilizadoEm: r.utilizado_em,
  };
}

export default async function ClientePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: resgates } = await supabase
    .from("resgates")
    .select("*, beneficios(titulo, tipo_desconto, valor_desconto, condicoes, parceiros(nome_negocio))")
    .eq("cliente_id", user.id)
    .in("status", ["pago", "utilizado"])
    .order("resgatado_em", { ascending: false })
    .returns<ResgateComDetalhes[]>();

  const disponiveis = (resgates ?? []).filter((r) => r.status === "pago").map(toCard);
  const usados = (resgates ?? []).filter((r) => r.status === "utilizado").map(toCard);

  if (!disponiveis.length && !usados.length) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-8 text-center shadow-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#df9c28]/12 text-[#c78716]">
          <Ticket size={22} strokeWidth={2} />
        </span>
        <h1 className="font-head text-lg font-bold text-[#263f40]">
          Você ainda não tem cupons
        </h1>
        <p className="text-sm text-[#5c6e6f]">
          Quando você comprar um benefício do clube, seu cupom aparece aqui, prontinho
          para mostrar aos parceiros.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {disponiveis.length > 0 && (
        <section>
          <h2 className="mb-3 font-head text-sm font-semibold tracking-wide text-[#5c6e6f] uppercase">
            Disponíveis
          </h2>
          <div className="flex flex-col gap-4">
            {disponiveis.map((c) => (
              <CupomCard key={c.codigo} cupom={c} />
            ))}
          </div>
        </section>
      )}

      {usados.length > 0 && (
        <section>
          <h2 className="mb-3 font-head text-sm font-semibold tracking-wide text-[#5c6e6f] uppercase">
            Já usados
          </h2>
          <div className="flex flex-col gap-4">
            {usados.map((c) => (
              <CupomCard key={c.codigo} cupom={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
