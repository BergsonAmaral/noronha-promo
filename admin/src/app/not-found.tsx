import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f8f8] px-6 text-center">
      <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#263f40]">
        Página não encontrada
      </h1>
      <Link href="/" className="rounded-lg bg-[#263f40] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#35494b]">
        Voltar ao início
      </Link>
    </main>
  );
}
