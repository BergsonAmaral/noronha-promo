import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";
import { CriarClienteForm } from "./criar-cliente-form";
import { Plus, UserRound, Mail } from "lucide-react";

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: clientes } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "cliente")
    .order("created_at", { ascending: false })
    .returns<Profile[]>();

  return (
    <div>
      <h1 className="font-head text-2xl font-bold text-[#263f40]">Clientes</h1>
      <p className="mt-1 text-sm text-[#5c6e6f]">
        Clientes do clube — crie o login deles aqui enquanto o cadastro pelo site
        (com pagamento) não existe.
      </p>

      <details className="mt-6 rounded-xl border border-[#e7e2d6] bg-white open:pb-5">
        <summary className="flex cursor-pointer items-center gap-2 px-4 py-3.5 text-sm font-semibold text-[#263f40]">
          <Plus size={16} strokeWidth={2.5} />
          Adicionar cliente
        </summary>
        <CriarClienteForm />
      </details>

      <div className="mt-6 grid gap-3">
        {clientes?.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-4 rounded-xl border border-[#e7e2d6] bg-white p-4"
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#eef4f2] text-[#48696c]">
              <UserRound size={18} strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="font-head text-sm font-semibold text-[#263f40]">{c.nome}</p>
              <p className="flex items-center gap-1.5 text-sm text-[#5c6e6f]">
                <Mail size={13} strokeWidth={2} />
                {c.email ?? "sem e-mail"}
              </p>
            </div>
          </div>
        ))}

        {!clientes?.length && (
          <div className="rounded-xl border border-dashed border-[#e7e2d6] bg-white p-8 text-center text-[#5c6e6f]">
            Nenhum cliente cadastrado ainda.
          </div>
        )}
      </div>
    </div>
  );
}
