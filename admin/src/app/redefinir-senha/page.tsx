import Image from "next/image";
import Link from "next/link";
import { AlterarSenhaForm } from "@/components/alterar-senha-form";

export default function RedefinirSenhaPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8f8] px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image src="/logo.png" alt="Noronha Promo" width={56} height={56} />
          <p className="font-[family-name:var(--font-manrope)] text-xl font-bold text-[#263f40]">
            Criar nova senha
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-black/5">
          <AlterarSenhaForm />
        </div>
        <p className="mt-6 text-center text-xs text-[#5c6e6f]">
          Depois de salvar,{" "}
          <Link href="/" className="font-semibold text-[#48696c] hover:underline">
            ir para o meu painel
          </Link>
        </p>
      </div>
    </main>
  );
}
