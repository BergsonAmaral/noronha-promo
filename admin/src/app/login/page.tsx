import Image from "next/image";
import Link from "next/link";
import { signIn } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen">
      {/* Painel esquerdo — identidade visual do site */}
      <div className="relative hidden w-1/2 overflow-hidden bg-[#48696c] lg:block">
        <Image
          src="/hero.jpg"
          alt="Fernando de Noronha"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#263f40] via-[#263f40]/60 to-[#263f40]/20" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Noronha Promo" width={48} height={48} />
            <div>
              <p className="font-[family-name:var(--font-manrope)] text-lg font-bold text-white">
                Noronha <span className="text-[#df9c28]">Promo</span>
              </p>
              <p className="text-[11px] tracking-wider text-[#cfe0e0] uppercase">
                Clube de descontos e experiências
              </p>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-[#efc982] uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[#df9c28]" />
              Painel administrativo
            </span>
            <h1 className="mt-3 font-[family-name:var(--font-manrope)] text-4xl font-bold leading-tight text-white">
              Mais Noronha.
              <br />
              Mais controle.
              <br />
              <em className="font-[family-name:var(--font-fraunces)] font-medium text-[#df9c28] not-italic italic">
                Tudo em um só lugar.
              </em>
            </h1>
            <p className="mt-4 max-w-sm text-sm text-[#d9e5e3]">
              Gerencie categorias, parceiros, benefícios e os cadastros
              recebidos pelo site — tudo sincronizado em tempo real.
            </p>
          </div>

          <p className="text-xs text-[#9db1b1]">
            Fernando de Noronha · Pernambuco, Brasil
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex w-full items-center justify-center bg-[#f7f8f8] px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-3 lg:hidden">
            <Image src="/logo.png" alt="Noronha Promo" width={56} height={56} />
            <div className="text-center">
              <p className="font-[family-name:var(--font-manrope)] text-xl font-bold text-[#263f40]">
                Noronha <span className="text-[#df9c28]">Promo</span>
              </p>
              <p className="text-xs text-[#5c6e6f]">Clube de descontos</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl shadow-black/5">
            <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#263f40]">
              Entrar
            </h2>
            <p className="mt-1 text-sm text-[#5c6e6f]">
              Clientes, parceiros e equipe entram por aqui.
            </p>

            <form action={signIn} className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-[#263f40]">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="rounded-lg border border-[#e7e2d6] px-3.5 py-2.5 text-sm text-[#263f40] outline-none transition focus:border-[#48696c] focus:ring-2 focus:ring-[#48696c]/15"
                  placeholder="voce@noronhapromo.com.br"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-[#263f40]">
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="rounded-lg border border-[#e7e2d6] px-3.5 py-2.5 text-sm text-[#263f40] outline-none transition focus:border-[#48696c] focus:ring-2 focus:ring-[#48696c]/15"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error === "Acesso restrito ao time administrativo" ||
                  error === "Link inválido ou expirado"
                    ? error
                    : /not confirmed/i.test(error)
                      ? "Confirme seu e-mail antes de entrar. Não recebeu? Use “Esqueci minha senha”."
                      : "E-mail ou senha inválidos."}
                </p>
              )}

              <Link
                href="/login/esqueci"
                className="-mt-1 self-end text-xs font-semibold text-[#48696c] hover:underline"
              >
                Esqueci minha senha
              </Link>

              <button
                type="submit"
                className="mt-2 rounded-lg bg-[#df9c28] px-4 py-2.5 text-sm font-semibold text-[#263f40] shadow-sm transition hover:bg-[#c78716] hover:shadow-md"
              >
                Entrar
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-[#5c6e6f]">
            Ainda não tem conta?{" "}
            <Link href="/login/cadastro" className="font-semibold text-[#48696c] hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
