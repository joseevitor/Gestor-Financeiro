"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Field from "@/components/ui/field";
import { inputClass } from "@/lib/utils";

const hoje = () => new Date().toISOString().slice(0, 10);

export default function NovaDividaForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({
    credor: "",
    descricao: "",
    valorTotal: "",
    dataCriacao: hoje(),
    vencimento: "",
    taxaJurosMensal: "",
    categoria: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const res = await fetch("/api/dividas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        taxaJurosMensal: form.taxaJurosMensal || undefined,
      }),
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
      <Field label="Credor" error={errors.credor}>
        <input
          className={inputClass}
          value={form.credor}
          onChange={(e) => setForm({ ...form, credor: e.target.value })}
          placeholder="Ex: Cartão Nubank"
          autoFocus
        />
      </Field>

      <Field label="Descrição (opcional)">
        <input
          className={inputClass}
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          placeholder="Ex: Fatura parcelada em atraso"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Valor total (R$)" error={errors.valorTotal}>
          <input
            type="number"
            step="0.01"
            min="0"
            className={inputClass}
            value={form.valorTotal}
            onChange={(e) => setForm({ ...form, valorTotal: e.target.value })}
            placeholder="0,00"
          />
        </Field>
        <Field label="Categoria" error={errors.categoria}>
          <input
            className={inputClass}
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            placeholder="Ex: Cartão de crédito"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Data de criação" error={errors.dataCriacao}>
          <input
            type="date"
            className={inputClass}
            value={form.dataCriacao}
            onChange={(e) => setForm({ ...form, dataCriacao: e.target.value })}
          />
        </Field>
        <Field label="Vencimento" error={errors.vencimento}>
          <input
            type="date"
            className={inputClass}
            value={form.vencimento}
            onChange={(e) => setForm({ ...form, vencimento: e.target.value })}
          />
        </Field>
      </div>

      <Field label="Juros ao mês, % (opcional)">
        <input
          type="number"
          step="0.01"
          min="0"
          className={inputClass}
          value={form.taxaJurosMensal}
          onChange={(e) => setForm({ ...form, taxaJurosMensal: e.target.value })}
          placeholder="Ex: 8.5"
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-accent py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Salvando..." : "Salvar dívida"}
      </button>
    </form>
  );
}
