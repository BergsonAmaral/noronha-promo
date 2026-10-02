import Image from "next/image";
import Link from "next/link";
import { pedirRedefinicao, reenviarConfirmacao } from "../actions";

const input =
  "rounded-lg border border-[#e7e2d6] px-3.5 py-2.5 text-sm text-[#263f40] outline-none transition focus:border-[#48696c] focus:ring-2 focus:ring-[#48696c]/15";
const botao =
  "rounded-lg bg-[#df9c28] px-4 py-2.5 text-sm font-semibold text-[#263f40] shadow-sm transition hover:bg-[#c78716]";

export default async function EsqueciPage({
  searchParams,
}: {
  searchParams: Promise<{ enviado?: string; reenviado?: string }>;
}) {
  const { enviado, reenviado } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8f8] px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image src="/logo.png" alt="Noronha Promo" width={56} height={56} />
          <p className="font-[family-name:var(--font-manrope)] text-xl font-bold text-[#263f40]">
            Noronha <span className="text-[#df9c28]">Promo</span>
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-black/5">
          {enviado || reenviado ? (
            <>
              <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#263f40]">
                Confira seu e-mail
              </h1>
              <p className="mt-2 text-sm text-[#5c6e6f]">
                {enviado
                  ? "Se esse e-mail tiver cadastro, enviamos um link para criar uma nova senha."
                  : "Se esse e-mail tiver uma conta aguardando confirmação, reenviamos o link."}
              </p>
            </>
          ) : (
            <>
              <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#263f40]">
                Esqueci minha senha
              </h1>
              <p className="mt-1 text-sm text-[#5c6e6f]">
                Informe seu e-mail e enviaremos um link para criar uma nova senha.
              </p>
              <form action={pedirRedefinicao} className="mt-6 flex flex-col gap-4">
                <input name="email" type="email" required autoComplete="email" placeholder="voce@email.com" className={input} />
                <button type="submit" className={botao}>
                  Enviar link
                </button>
              </form>

              <div className="mt-6 border-t border-[#e7e2d6] pt-5">
                <p className="text-sm font-semibold text-[#263f40]">Não recebeu o e-mail de confirmação?</p>
                <form action={reenviarConfirmacao} className="mt-3 flex flex-col gap-3">
                  <input name="email" type="email" required placeholder="voce@email.com" className={input} />
                  <button
                    type="submit"
                    className="rounded-lg border border-[#e7e2d6] px-4 py-2.5 text-sm font-semibold text-[#425c5a] hover:bg-[#f7f8f8]"
                  >
                    Reenviar confirmação
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-[#5c6e6f]">
          <Link href="/login" className="font-semibold text-[#48696c] hover:underline">
            Voltar para o login
          </Link>
        </p>
      </div>
    </main>
  );
}
