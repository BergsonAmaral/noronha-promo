import { signIn } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eef4f2] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg shadow-black/5">
        <div className="mb-8 text-center">
          <h1 className="font-semibold text-2xl text-[#263f40]">Noronha Promo</h1>
          <p className="mt-1 text-sm text-[#5c6e6f]">Painel administrativo</p>
        </div>

        <form action={signIn} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-[#263f40]">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="rounded-lg border border-[#e7e2d6] px-3 py-2.5 text-sm outline-none focus:border-[#48696c] focus:ring-2 focus:ring-[#48696c]/20"
              placeholder="voce@noronhapromo.com.br"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-[#263f40]">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="rounded-lg border border-[#e7e2d6] px-3 py-2.5 text-sm outline-none focus:border-[#48696c] focus:ring-2 focus:ring-[#48696c]/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              E-mail ou senha inválidos.
            </p>
          )}

          <button
            type="submit"
            className="mt-2 rounded-lg bg-[#df9c28] px-4 py-2.5 text-sm font-semibold text-[#263f40] transition hover:bg-[#c78716]"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
