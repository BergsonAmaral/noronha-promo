import Image from "next/image";
import { Hammer } from "lucide-react";
import { signOut } from "@/app/login/actions";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Image src="/logo.png" alt="Noronha Promo" width={56} height={56} />
      <span className="mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#df9c28]/15 text-[#c78716]">
        <Hammer size={22} strokeWidth={2} />
      </span>
      <h1 className="mt-4 font-head text-2xl font-bold text-[#263f40]">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-[#5c6e6f]">{description}</p>

      <form action={signOut} className="mt-8">
        <button
          type="submit"
          className="rounded-lg border border-[#e7e2d6] px-4 py-2 text-sm font-medium text-[#425c5a] hover:bg-[#f7f8f8]"
        >
          Sair
        </button>
      </form>
    </main>
  );
}
