import { Star } from "lucide-react";
import type { Avaliacao, Profile } from "@/lib/supabase/types";

type AvaliacaoComCliente = Avaliacao & { profiles: Pick<Profile, "nome"> | null };

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

export function AvaliacoesResumo({ avaliacoes }: { avaliacoes: AvaliacaoComCliente[] }) {
  const media =
    avaliacoes.length > 0
      ? avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length
      : 0;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-head text-lg font-bold text-[#263f40]">Avaliações</h2>
        {avaliacoes.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Star size={16} strokeWidth={2} className="fill-[#df9c28] text-[#df9c28]" />
            <span className="font-head font-bold text-[#263f40]">{media.toFixed(1)}</span>
            <span className="text-sm text-[#9db1b1]">({avaliacoes.length})</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {avaliacoes.map((a) => (
          <div key={a.id} className="border-t border-[#e7e2d6] pt-4 first:border-t-0 first:pt-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#263f40]">
                {a.profiles?.nome ?? "Cliente"}
              </p>
              <span className="text-xs text-[#9db1b1]">{formatData(a.created_at)}</span>
            </div>
            <div className="mt-1">
              <Estrelas nota={a.nota} />
            </div>
            {a.comentario && (
              <p className="mt-2 text-sm text-[#425c5a]">{a.comentario}</p>
            )}
          </div>
        ))}

        {!avaliacoes.length && (
          <p className="text-sm text-[#9db1b1]">Nenhuma avaliação recebida ainda.</p>
        )}
      </div>
    </div>
  );
}
