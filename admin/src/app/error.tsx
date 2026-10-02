"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f8f8] px-6 text-center">
      <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#263f40]">
        Algo deu errado
      </h1>
      <p className="max-w-sm text-sm text-[#5c6e6f]">
        Não foi possível carregar esta página. Tente novamente em instantes.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-[#263f40] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#35494b]"
      >
        Tentar de novo
      </button>
    </main>
  );
}
