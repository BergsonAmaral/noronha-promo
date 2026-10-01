import Image from "next/image";
import Link from "next/link";
import { signUp } from "../actions";

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; confirmar?: string }>;
}) {
  const { error, confirmar } = await searchParams;

  return (
    <main className="flex min-h-screen">
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
              Clube do cliente
            </span>
            <h1 className="mt-3 font-[family-name:var(--font-manrope)] text-4xl font-bold leading-tight text-white">
              Seu cartão de
              <br />
              descontos em
              <br />
              <em className="font-[family-name:var(--font-fraunces)] font-medium text-[#df9c28] not-italic italic">
                Fernando de Noronha.
              </em>
            </h1>
            <p className="mt-4 max-w-sm text-sm text-[#d9e5e3]">
              Crie sua conta para comprar cupons e mostrar o QR code direto para
              os parceiros do clube.
            </p>
          </div>

          <p className="text-xs text-[#9db1b1]">
            Fernando de Noronha · Pernambuco, Brasil
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-[#f7f8f8] px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-3 lg:hidden">
            <Image src="/logo.png" alt="Noronha Promo" width={56} height={56} />
            <div className="text-center">
              <p className="font-[family-name:var(--font-manrope)] text-xl font-bold text-[#263f40]">
                Noronha <span className="text-[#df9c28]">Promo</span>
              </p>
              <p className="text-xs text-[#5c6e6f]">Clube do cliente</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl shadow-black/5">
            {confirmar ? (
              <>
                <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#263f40]">
                  Quase lá!
                </h2>
                <p className="mt-2 text-sm text-[#5c6e6f]">
                  Enviamos um e-mail de confirmação para você. Clique no link
                  para ativar sua conta e depois é só entrar.
                </p>
                <Link
                  href="/login"
                  className="mt-6 inline-block rounded-lg bg-[#263f40] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#35494b]"
                >
                  Ir para o login
                </Link>
              </>
            ) : (
              <>
                <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#263f40]">
                  Criar conta
                </h2>
                <p className="mt-1 text-sm text-[#5c6e6f]">
                  Leva menos de um minuto.
                </p>

                <form action={signUp} className="mt-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="nome" className="text-sm font-semibold text-[#263f40]">
                      Nome
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      required
                      autoComplete="name"
                      className="rounded-lg border border-[#e7e2d6] px-3.5 py-2.5 text-sm text-[#263f40] outline-none transition focus:border-[#48696c] focus:ring-2 focus:ring-[#48696c]/15"
                      placeholder="Seu nome"
                    />
                  </div>

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
                      placeholder="voce@email.com"
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
                      autoComplete="new-password"
                      className="rounded-lg border border-[#e7e2d6] px-3.5 py-2.5 text-sm text-[#263f40] outline-none transition focus:border-[#48696c] focus:ring-2 focus:ring-[#48696c]/15"
                      placeholder="mínimo 6 caracteres"
                    />
                  </div>

                  {error && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="mt-2 rounded-lg bg-[#df9c28] px-4 py-2.5 text-sm font-semibold text-[#263f40] shadow-sm transition hover:bg-[#c78716] hover:shadow-md"
                  >
                    Criar conta
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-[#5c6e6f]">
            Já tem conta?{" "}
            <Link href="/login" className="font-semibold text-[#48696c] hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
