"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Field from "@/components/ui/field";
import { inputClass } from "@/lib/utils";
import { Rendimento } from "@/lib/types";

const hoje = () => new Date().toISOString().slice(0, 10);

type CategoriaRendimento = Rendimento["categoria"];

const CATEGORIAS: { value: CategoriaRendimento; label: string }[] = [
  { value: "salario", label: "Salário" },
  { value: "freelance", label: "Freelance" },
  { value: "investimento", label: "Investimento" },
  { value: "outros", label: "Outros" },
];

export default function NovoRendimentoForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({
    fonte: "",
    descricao: "",
    valor: "",
    data: hoje(),
    categoria: "salario" as CategoriaRendimento,
    recorrente: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const res = await fetch("/api/rendimentos", {
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
      <Field label="Fonte" error={errors.fonte}>
        <input
          className={inputClass}
          value={form.fonte}
          onChange={(e) => setForm({ ...form, fonte: e.target.value })}
          placeholder="Ex: Salário CLT"
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

      <Field label="Categoria">
        <select
          className={inputClass}
          value={form.categoria}
          onChange={(e) =>
            setForm({ ...form, categoria: e.target.value as CategoriaRendimento })
          }
        >
          {CATEGORIAS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Descrição (opcional)">
        <input
          className={inputClass}
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          placeholder="Ex: Projeto landing page"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-ink-muted">
        <input
          type="checkbox"
          checked={form.recorrente}
          onChange={(e) => setForm({ ...form, recorrente: e.target.checked })}
          className="h-4 w-4 rounded border-line accent-[var(--accent)]"
        />
        Este rendimento é recorrente (se repete todo mês)
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-accent py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Salvando..." : "Salvar rendimento"}
      </button>
    </form>
  );
}
