"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Field from "@/components/ui/field";
import { inputClass } from "@/lib/utils";
import { FormaPagamento } from "@/lib/types";

const hoje = () => new Date().toISOString().slice(0, 10);

const FORMAS: { value: FormaPagamento; label: string }[] = [
  { value: "pix", label: "Pix" },
  { value: "boleto", label: "Boleto" },
  { value: "transferencia", label: "Transferência" },
  { value: "cartao_debito", label: "Cartão de débito" },
  { value: "cartao_credito", label: "Cartão de crédito" },
  { value: "dinheiro", label: "Dinheiro" },
];

export default function PagamentoForm({
  dividaId,
  saldoRestante,
  onDone,
}: {
  dividaId: string;
  saldoRestante: number;
  onDone: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    valor: "",
    data: hoje(),
    formaPagamento: "pix" as FormaPagamento,
    observacao: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const res = await fetch(`/api/dividas/${dividaId}/pagamentos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      const fieldErrors: Record<string, string> = {};
      for (const [key, val] of Object.entries(data.error?.fieldErrors ?? {})) {
        if (Array.isArray(val) && val[0]) fieldErrors[key] = val[0] as string;
      }
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    router.refresh();
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-ink-muted">
        Saldo restante atual:{" "}
        <span className="font-mono text-ink">
          {saldoRestante.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </span>
      </p>

      <Field label="Valor pago (R$)" error={errors.valor}>
        <input
          type="number"
          step="0.01"
          min="0"
          className={inputClass}
          value={form.valor}
          onChange={(e) => setForm({ ...form, valor: e.target.value })}
          placeholder="0,00"
          autoFocus
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Data" error={errors.data}>
          <input
            type="date"
            className={inputClass}
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
          />
        </Field>
        <Field label="Forma de pagamento">
          <select
            className={inputClass}
            value={form.formaPagamento}
            onChange={(e) =>
              setForm({ ...form, formaPagamento: e.target.value as FormaPagamento })
            }
          >
            {FORMAS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Observação (opcional)">
        <input
          className={inputClass}
          value={form.observacao}
          onChange={(e) => setForm({ ...form, observacao: e.target.value })}
          placeholder="Ex: pagamento parcial combinado com o credor"
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-accent py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Registrando..." : "Registrar pagamento"}
      </button>
    </form>
  );
}
