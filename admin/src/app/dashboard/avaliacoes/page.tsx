import { createClient } from "@/lib/supabase/server";
import type { Avaliacao, Parceiro, Profile } from "@/lib/supabase/types";
import { excluirAvaliacao } from "./actions";
import { Star, Trash2 } from "lucide-react";

type AvaliacaoCompleta = Avaliacao & {
  parceiros: Pick<Parceiro, "nome_negocio"> | null;
  profiles: Pick<Profile, "nome"> | null;
};

function formatData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function Estrelas({ nota }: { nota: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          strokeWidth={2}
          className={n <= nota ? "fill-[#df9c28] text-[#df9c28]" : "fill-transparent text-[#e7e2d6]"}
        />
      ))}
    </div>
  );
}

export default async function AvaliacoesAdminPage() {
  const supabase = await createClient();
  const { data: avaliacoes } = await supabase
    .from("avaliacoes")
    .select("*, parceiros(nome_negocio), profiles(nome)")
    .order("created_at", { ascending: false })
    .returns<AvaliacaoCompleta[]>();

  const media =
    avaliacoes && avaliacoes.length > 0
      ? avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length
      : 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-head text-2xl font-bold text-[#263f40]">Avaliações</h1>
          <p className="mt-1 text-sm text-[#5c6e6f]">
            Avaliações que os clientes deixaram para os parceiros.
          </p>
        </div>
        {!!avaliacoes?.length && (
          <div className="flex items-center gap-1.5">
            <Star size={18} strokeWidth={2} className="fill-[#df9c28] text-[#df9c28]" />
            <span className="font-head text-lg font-bold text-[#263f40]">{media.toFixed(1)}</span>
            <span className="text-sm text-[#9db1b1]">({avaliacoes.length})</span>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-3">
        {avaliacoes?.map((a) => (
          <div key={a.id} className="rounded-xl border border-[#e7e2d6] bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-head text-sm font-semibold text-[#263f40]">
                  {a.parceiros?.nome_negocio ?? "Parceiro removido"}
                </p>
                <p className="mt-0.5 text-sm text-[#5c6e6f]">
                  {a.profiles?.nome ?? "Cliente"} · {formatData(a.created_at)}
                </p>
                <div className="mt-2">
                  <Estrelas nota={a.nota} />
                </div>
                {a.comentario && (
                  <p className="mt-2 max-w-2xl text-sm text-[#425c5a]">{a.comentario}</p>
                )}
              </div>
              <form action={excluirAvaliacao.bind(null, a.id)}>
                <button
                  title="Excluir avaliação"
                  className="flex items-center gap-1.5 rounded-lg border border-[#e7e2d6] px-3 py-1.5 text-xs font-semibold text-[#425c5a] hover:bg-[#f7f8f8]"
                >
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </form>
            </div>
          </div>
        ))}

        {!avaliacoes?.length && (
          <div className="rounded-xl border border-dashed border-[#e7e2d6] bg-white p-8 text-center text-[#5c6e6f]">
            Nenhuma avaliação recebida ainda.
          </div>
        )}
      </div>
    </div>
  );
}
