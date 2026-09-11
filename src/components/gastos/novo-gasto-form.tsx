"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Field from "@/components/ui/field";
import { inputClass } from "@/lib/utils";
import { CategoriaGasto, FormaPagamento } from "@/lib/types";

const hoje = () => new Date().toISOString().slice(0, 10);

const CATEGORIAS: { value: CategoriaGasto; label: string }[] = [
  { value: "moradia", label: "Moradia" },
  { value: "alimentacao", label: "Alimentação" },
  { value: "transporte", label: "Transporte" },
  { value: "saude", label: "Saúde" },
  { value: "lazer", label: "Lazer" },
  { value: "educacao", label: "Educação" },
  { value: "outros", label: "Outros" },
];

const FORMAS: { value: FormaPagamento; label: string }[] = [
  { value: "pix", label: "Pix" },
  { value: "boleto", label: "Boleto" },
  { value: "transferencia", label: "Transferência" },
  { value: "cartao_debito", label: "Cartão de débito" },
  { value: "cartao_credito", label: "Cartão de crédito" },
  { value: "dinheiro", label: "Dinheiro" },
];

export default function NovoGastoForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    data: hoje(),
    categoria: "moradia" as CategoriaGasto,
    formaPagamento: "pix" as FormaPagamento,
    fixo: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const res = await fetch("/api/gastos", {
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
      <Field label="Descrição" error={errors.descricao}>
        <input
          className={inputClass}
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          placeholder="Ex: Supermercado"
          autoFocus
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Valor (R$)" error={errors.valor}>
          <input
            type="number"
            step="0.01"
            min="0"
            className={inputClass}
            value={form.valor}
            onChange={(e) => setForm({ ...form, valor: e.target.value })}
            placeholder="0,00"
          />
        </Field>
        <Field label="Data" error={errors.data}>
          <input
            type="date"
            className={inputClass}
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Categoria">
          <select
            className={inputClass}
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value as CategoriaGasto })}
          >
            {CATEGORIAS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
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

      <label className="flex items-center gap-2 text-sm text-ink-muted">
        <input
          type="checkbox"
          checked={form.fixo}
          onChange={(e) => setForm({ ...form, fixo: e.target.checked })}
          className="h-4 w-4 rounded border-line accent-[var(--accent)]"
        />
        Este é um gasto fixo (se repete todo mês)
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-accent py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Salvando..." : "Salvar gasto"}
      </button>
    </form>
  );
}
