import type { LucideIcon } from "lucide-react";
import { signOut } from "@/app/login/actions";

export function SignOutButton({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-[#e0a9a4] transition hover:bg-red-500/10"
      >
        <Icon size={16} strokeWidth={2} />
        Sair
      </button>
    </form>
  );
}
