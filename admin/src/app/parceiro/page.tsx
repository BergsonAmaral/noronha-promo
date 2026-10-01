import { CupomValidator } from "@/components/cupom-validator";

export default function ParceiroPage() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="font-head text-xl font-bold text-[#263f40]">Validar cupom</h1>
      <p className="mt-1 mb-6 text-sm text-[#5c6e6f]">
        Escaneie o QR Code que o cliente apresentar ou digite o código do cupom.
      </p>
      <CupomValidator />
    </div>
  );
}
